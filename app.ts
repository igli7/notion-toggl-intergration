import * as dotenv from 'dotenv';
import express from 'express';
import { createTogglClientsFromPages } from './helpers/createTogglClientsFromPages';
import { createTogglProjetcs } from './helpers/createTogglProjetcs';
import { createTogglTasks } from './helpers/createTogglTasks';
import { updateNotionTasks } from './helpers/updateNotionTaskIds';
import notion from './lib/notion';
import { NotionData } from './types/NotionData';
dotenv.config();

const app = express();

app.get('/', async (req, res) => {
  let prevNotionData: NotionData;

  const main = async () => {
    try {
      console.log("I'M HERE", new Date());
      const notionData = (await notion.search({
        filter: {
          property: 'object',
          value: 'page',
        },
      })) as NotionData;

      // Console.log on the browser
      // res.send(
      //   `<script>
      //       console.log("All pages",${JSON.stringify(notionData, null, 2)})
      //   </script>`,
      // );

      if (JSON.stringify(notionData) !== JSON.stringify(prevNotionData)) {
        await updateNotionTasks({
          notionData,
          prevNotionData,
        });

        console.log('DIFFERENT NOTION DATA');
        await createTogglClientsFromPages({
          notionData,
          prevNotionData,
        });

        await createTogglProjetcs({
          notionData,
          prevNotionData,
        });

        await createTogglTasks({
          notionData,
          prevNotionData,
        });
      } else {
        console.log('SAME NOTION DATA');
      }

      prevNotionData = notionData;
    } catch (error) {
      console.log('ERROR NOTION', error);
      console.error(error);
    }

    setTimeout(main, 60000);
  };

  main();
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
