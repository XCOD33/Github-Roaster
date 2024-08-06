const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

require('dotenv').config();

const getGithubProfile = async (username) => {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to get Github profile: ${err}. Status code: ${err.response.status}`);
    return null;
  }
};

const getGithubRepos = async (username) => {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}/repos`);
    const repos = res.data.map((repo) => ({
      url: repo.url,
      stargazers_count: repo.stargazers_count,
      watchers_count: repo.watchers_count,
      language: repo.language,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      forks: repo.forks,
    }));

    return repos;
  } catch (err) {
    console.error(`Failed to get Github repos: ${err}. Status code: ${err.response.status}`);
    return null;
  }
};

const getGithubReadme = async (username) => {
  try {
    const res = await axios.get(
      `https://raw.githubusercontent.com/${username}/${username}/main/README.md`
    );
    return res.data;
  } catch (err) {
    console.error(`Failed to get Github README: ${err}. Status code: ${err.response.status}`);
  }
};

const runGenerativeAI = async (profileData, readmeData, reposData) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction:
      'Kamu adalah seorang roaster keras, tugas kamu adalah membuat roasting dari profile github seseorang. Output harus berisi analisis kamu dengan hasil roasting dari profile github orang tersebut. output hanya berbentuk paragraf dengan bahasa gaul',
    safe: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  const generationConfig = {
    temperature: 0.8,
    topP: 0.95,
    topK: 50,
    maxOutputTokens: 350,
    responseMimeType: 'text/plain',
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: 'user',
        parts: [
          { text: `detail profile github dia : ${JSON.stringify(profileData)}` },
          {
            text: 'jangan ada kalimat motivasi, semuanya adalah kalimat kebencian. berikan kalimat yang sangat menyakitkan diucapkan oleh seseorang',
          },
          { text: `detail bio README nya : ${readmeData}` },
          { text: `ini adalah detail repo yang dia punya : ${JSON.stringify(reposData)}` },
          {
            text: 'output langsung menjadi satu paragraf yang memang kalimatnya nyambung dan efektif',
          },
        ],
      },
    ],
  });

  try {
    const result = await chatSession.sendMessage('roasting bisa dimulai');
    return result.response.text();
  } catch (err) {
    console.error(`Failed to run generative AI: ${err}`);
    return null;
  }
};

router.post('/roast', async (req, res) => {
  const username = req.body.username;
  const profileData = await getGithubProfile(username);
  const reposData = await getGithubRepos(username);
  const readmeData = await getGithubReadme(username);

  if (profileData && reposData) {
    try {
      console.log(profileData, readmeData, reposData);
      const result = await runGenerativeAI(profileData, readmeData, reposData);
      if (result == null) {
        res.send('Failed to run generative AI');
      } else {
        res.send(result);
      }
    } catch (err) {
      console.error(`Failed to run generative AI: ${err}`);
      res.send('Failed to run generative AI: ${err}');
    }
  } else {
    console.error('Failed to get Github data');
    res.send('Failed to get Github data');
  }
});

module.exports = router;
