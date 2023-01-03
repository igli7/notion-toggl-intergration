"use strict";
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
exports.createTogglTasks = void 0;
const notion_1 = __importDefault(require("../lib/notion"));
const togglHelper_1 = require("./togglHelper");
//@ts-ignore
const random_hex_color_1 = __importDefault(require("random-hex-color"));
const createTogglTasks = ({ notionData, prevNotionData, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const tasks = (_a = notionData === null || notionData === void 0 ? void 0 : notionData.results) === null || _a === void 0 ? void 0 : _a.filter((task) => {
        var _a, _b, _c;
        //@ts-ignore
        return 'Task name' in (task === null || task === void 0 ? void 0 : task.properties) &&
            //@ts-ignore
            ((_c = (_b = (_a = task === null || task === void 0 ? void 0 : task.properties) === null || _a === void 0 ? void 0 : _a.Status) === null || _b === void 0 ? void 0 : _b.status) === null || _c === void 0 ? void 0 : _c.id) === 'in-progress';
    });
    if (!tasks) {
        console.log('NO TASKS');
        return;
    }
    const prevTasks = (_b = prevNotionData === null || prevNotionData === void 0 ? void 0 : prevNotionData.results) === null || _b === void 0 ? void 0 : _b.filter((task) => {
        var _a, _b, _c;
        //@ts-ignore
        return 'Task name' in (task === null || task === void 0 ? void 0 : task.properties) &&
            //@ts-ignore
            ((_c = (_b = (_a = task === null || task === void 0 ? void 0 : task.properties) === null || _a === void 0 ? void 0 : _a.Status) === null || _b === void 0 ? void 0 : _b.status) === null || _c === void 0 ? void 0 : _c.id) === 'in-progress';
    });
    if (JSON.stringify(tasks) === JSON.stringify(prevTasks)) {
        console.log('SAME TASKS');
        return;
    }
    // const togglTasks = await togglHelper({
    //   method: 'GET',
    //   endpoint: 'projects',
    // });
    // const differentProjects = tasks?.filter((project: any) => {
    //   //@ts-ignore
    //   return !togglProjects?.data?.some(
    //     (togglProject: any) =>
    //       togglProject?.name ===
    //       project?.properties?.['Project name']?.title?.[0]?.plain_text,
    //   );
    // });
    // console.log('differentProjects', differentProjects);
    //@ts-ignore
    // console.log('togglProjects', togglProjects.data);
    // console.log(
    //   'PROJECT NAME',
    //   //@ts-ignore
    //   projects?.[0]?.properties?.['Project name']?.title?.[0]?.plain_text,
    // );
    // if (!differentProjects) {
    //   return;
    // }
    yield Promise.all(tasks.map((project) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d, _e, _f, _g, _h, _j;
        const databaseId = (_c = project === null || project === void 0 ? void 0 : project.parent) === null || _c === void 0 ? void 0 : _c.database_id;
        const database = yield notion_1.default.databases.retrieve({
            database_id: databaseId,
        });
        console.log('databaseId', databaseId);
        //@ts-ignore
        console.log('database', database === null || database === void 0 ? void 0 : database.parent);
        const workspacePage = (_d = notionData === null || notionData === void 0 ? void 0 : notionData.results) === null || _d === void 0 ? void 0 : _d.find(
        //@ts-ignore
        (data) => { var _a; return data.id === ((_a = database === null || database === void 0 ? void 0 : database.parent) === null || _a === void 0 ? void 0 : _a.page_id); });
        console.log('workspacePage', workspacePage);
        const clients = yield (0, togglHelper_1.togglHelper)({
            method: 'GET',
            endpoint: 'clients',
        });
        //@ts-ignore
        const client = (_e = clients === null || clients === void 0 ? void 0 : clients.data) === null || _e === void 0 ? void 0 : _e.find((obj) => {
            var _a, _b, _c, _d;
            return (obj === null || obj === void 0 ? void 0 : obj.name) ===
                (
                //@ts-ignore
                (_d = (_c = (_b = (_a = workspacePage === null || workspacePage === void 0 ? void 0 : workspacePage.properties) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.title) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.plain_text);
        });
        console.log('client', client);
        yield (0, togglHelper_1.togglHelper)({
            method: 'POST',
            endpoint: 'projects',
            data: {
                client_id: client.id,
                name: (_j = (_h = (_g = (_f = project === null || project === void 0 ? void 0 : project.properties) === null || _f === void 0 ? void 0 : _f['Project name']) === null || _g === void 0 ? void 0 : _g.title) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.plain_text,
                is_private: true,
                active: true,
                color: (0, random_hex_color_1.default)(),
                billable: true,
                template: false,
                auto_estimates: true,
                //   estimated_hours: parseInt(
                //     project?.properties?.Estimates?.select?.name,
                //   ),
                rate: null,
                cid: client.id,
            },
        });
    })));
});
exports.createTogglTasks = createTogglTasks;
