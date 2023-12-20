import axios from "axios";
import * as cheerio from "cheerio";
import randomUseragent from "random-useragent";
import fs from "fs";
const rua = randomUseragent.getRandom();

const iter = 1000;
const baseUrl = "https://randomword.com";
const partOfSpeech = "adjective";
const filePath = `data/${partOfSpeech}.txt`;

for (let i = 0; i < iter; i++) {
  axios({
    method: "GET",
    url: `${baseUrl}/${partOfSpeech}`,
    headers: {
      "User-Agent": rua,
    },
  })
    .then(function (response) {
      const $ = cheerio.load(response.data);

      let word = $(".section #shared_section")
        .find("#random_word")
        .eq(0)
        .text()
        .replace("\r\n\t\t\t\t\t", "")
        .replace("\r\n\t\t\t\t", "")
        .replace("\n\t\t\t\t\t", "")
        .replace("\n\t\t\t\t", "")
        .replaceAll('"', "");
      if (word.length > 15) {
        console.log("*** Lengthy skipped");
        return;
      }

      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        if (data.includes(word)) {
          console.log("*** Duplicate skipped");
          return;
        }
      }

      fs.appendFileSync(filePath, `${word}\n`);
      console.log(word, "- saved");
    })
    .catch(function (error) {
      console.log("Something Went Wrong");
    });
}
