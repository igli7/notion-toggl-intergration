"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const createToggleProjects_1 = require("./helpers/createToggleProjects");
const notion_1 = __importDefault(require("./lib/notion"));
const app = (0, express_1.default)();
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   const res1 = await togglHelper({
    //     endpoint: 'clients',
    //     method: 'POST',
    //     data: {
    //       name: 'test client 1',
    //     },
    //   });
    //   console.log('res1', res1);
    let prevNotionData;
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        // Calls Display Function
        const notionData = yield notion_1.default.search({
            filter: {
                property: 'object',
                value: 'page',
            },
        });
        res.send(`<script>
          console.log("All pages",${JSON.stringify(notionData, null, 2)})
      </script>`);
        if (JSON.stringify(notionData) !== JSON.stringify(prevNotionData)) {
            console.log('DIFFERENT NOTION DATA');
            //   await createTogglClientsFromPages({
            //     notionData,
            //     prevNotionData,
            //   });
            yield (0, createToggleProjects_1.createTogglProjetcs)({
                notionData,
                prevNotionData,
            });
        }
        else {
            console.log('SAME NOTION DATA');
        }
        prevNotionData = notionData;
    }), 5000);
    //   const pagesFiltered = pages.results.filter(
    //     //@ts-ignore
    //     (page) => page?.properties?.Status?.status?.id === 'in-progress',
    //   );
    //   //@ts-ignore
    //   const tasks = pagesFiltered.filter((page) => 'Task name' in page?.properties);
    //   const projects = pagesFiltered.filter(
    //     //@ts-ignore
    //     (page) => 'Project name' in page?.properties,
    //   );
    //   const databases = await notion.search({
    //     filter: {
    //       property: 'object',
    //       value: 'database',
    //     },
    //   });
    //   res.send(
    //     `<script>
    //         console.log("All pages",${JSON.stringify(pages, null, 2)})
    //         console.log("workspacePages",${JSON.stringify(workspacePages, null, 2)})
    //         console.log("tasks",${JSON.stringify(tasks, null, 2)})
    //         console.log("projects",${JSON.stringify(projects, null, 2)})
    //         console.log("databases",${JSON.stringify(databases, null, 2)})
    //     </script>`,
    //   );
}));
const port = 8000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
