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
exports.createTogglProjetcs = void 0;
const notion_1 = __importDefault(require("../lib/notion"));
const togglHelper_1 = require("./togglHelper");
//@ts-ignore
const random_hex_color_1 = __importDefault(require("random-hex-color"));
const createTogglProjetcs = ({ notionData, prevNotionData, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const projects = (_a = notionData === null || notionData === void 0 ? void 0 : notionData.results) === null || _a === void 0 ? void 0 : _a.filter((project) => {
        var _a, _b, _c;
        //@ts-ignore
        return 'Project name' in (project === null || project === void 0 ? void 0 : project.properties) &&
            //@ts-ignore
            ((_c = (_b = (_a = project === null || project === void 0 ? void 0 : project.properties) === null || _a === void 0 ? void 0 : _a.Status) === null || _b === void 0 ? void 0 : _b.status) === null || _c === void 0 ? void 0 : _c.id) === 'in-progress';
    });
    console.log('projects', projects);
    const prevProjects = (_b = prevNotionData === null || prevNotionData === void 0 ? void 0 : prevNotionData.results) === null || _b === void 0 ? void 0 : _b.filter((project) => {
        var _a, _b, _c;
        //@ts-ignore
        return 'Project name' in (project === null || project === void 0 ? void 0 : project.properties) &&
            //@ts-ignore
            ((_c = (_b = (_a = project === null || project === void 0 ? void 0 : project.properties) === null || _a === void 0 ? void 0 : _a.Status) === null || _b === void 0 ? void 0 : _b.status) === null || _c === void 0 ? void 0 : _c.id) === 'in-progress';
    });
    if (JSON.stringify(projects) === JSON.stringify(prevProjects)) {
        console.log('SAME PROJECT');
        return;
    }
    const togglProjects = yield (0, togglHelper_1.togglHelper)({
        method: 'GET',
        endpoint: 'projects',
    });
    const differentProjects = projects === null || projects === void 0 ? void 0 : projects.filter((project) => {
        var _a;
        //@ts-ignore
        return !((_a = togglProjects === null || togglProjects === void 0 ? void 0 : togglProjects.data) === null || _a === void 0 ? void 0 : _a.some((togglProject) => {
            var _a, _b, _c, _d;
            return (togglProject === null || togglProject === void 0 ? void 0 : togglProject.name) ===
                ((_d = (_c = (_b = (_a = project === null || project === void 0 ? void 0 : project.properties) === null || _a === void 0 ? void 0 : _a['Project name']) === null || _b === void 0 ? void 0 : _b.title) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.plain_text);
        }));
    });
    console.log('differentProjects', differentProjects);
    //@ts-ignore
    console.log('togglProjects', togglProjects.data);
    console.log('PROJECT NAME', 
    //@ts-ignore
    (_g = (_f = (_e = (_d = (_c = projects === null || projects === void 0 ? void 0 : projects[0]) === null || _c === void 0 ? void 0 : _c.properties) === null || _d === void 0 ? void 0 : _d['Project name']) === null || _e === void 0 ? void 0 : _e.title) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.plain_text);
    if (!differentProjects) {
        return;
    }
    yield Promise.all(differentProjects.map((project) => __awaiter(void 0, void 0, void 0, function* () {
        var _h, _j, _k, _l, _m, _o, _p;
        const databaseId = (_h = project === null || project === void 0 ? void 0 : project.parent) === null || _h === void 0 ? void 0 : _h.database_id;
        const database = yield notion_1.default.databases.retrieve({
            database_id: databaseId,
        });
        console.log('databaseId', databaseId);
        //@ts-ignore
        console.log('database', database === null || database === void 0 ? void 0 : database.parent);
        const workspacePage = (_j = notionData === null || notionData === void 0 ? void 0 : notionData.results) === null || _j === void 0 ? void 0 : _j.find(
        //@ts-ignore
        (data) => { var _a; return data.id === ((_a = database === null || database === void 0 ? void 0 : database.parent) === null || _a === void 0 ? void 0 : _a.page_id); });
        console.log('workspacePage', workspacePage);
        const clients = yield (0, togglHelper_1.togglHelper)({
            method: 'GET',
            endpoint: 'clients',
        });
        //@ts-ignore
        const client = (_k = clients === null || clients === void 0 ? void 0 : clients.data) === null || _k === void 0 ? void 0 : _k.find((obj) => {
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
                name: (_p = (_o = (_m = (_l = project === null || project === void 0 ? void 0 : project.properties) === null || _l === void 0 ? void 0 : _l['Project name']) === null || _m === void 0 ? void 0 : _m.title) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.plain_text,
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
exports.createTogglProjetcs = createTogglProjetcs;
