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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTogglClientsFromPages = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const togglHelper_1 = require("./togglHelper");
const createTogglClientsFromPages = ({ notionData, prevNotionData, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    //@ts-ignore
    const workspacePages = (_a = notionData === null || notionData === void 0 ? void 0 : notionData.results) === null || _a === void 0 ? void 0 : _a.filter(
    //@ts-ignore
    (page) => { var _a; return ((_a = page === null || page === void 0 ? void 0 : page.parent) === null || _a === void 0 ? void 0 : _a.type) === 'workspace'; });
    //@ts-ignore
    const prevWorkspacePages = (_b = prevNotionData === null || prevNotionData === void 0 ? void 0 : prevNotionData.results) === null || _b === void 0 ? void 0 : _b.filter(
    //@ts-ignore
    (page) => { var _a; return ((_a = page === null || page === void 0 ? void 0 : page.parent) === null || _a === void 0 ? void 0 : _a.type) === 'workspace'; });
    if (JSON.stringify(workspacePages) === JSON.stringify(prevWorkspacePages)) {
        console.log('SAME WORKSPACE PAGES');
        return;
    }
    const togglClients = yield (0, togglHelper_1.togglHelper)({
        method: 'GET',
        endpoint: 'clients',
    });
    console.log('togglClients', togglClients);
    const differentWorkspacePages = workspacePages === null || workspacePages === void 0 ? void 0 : workspacePages.filter((page) => {
        var _a;
        //@ts-ignore
        return !((_a = togglClients === null || togglClients === void 0 ? void 0 : togglClients.data) === null || _a === void 0 ? void 0 : _a.some((client) => { var _a, _b, _c, _d; return !client.name === ((_d = (_c = (_b = (_a = page === null || page === void 0 ? void 0 : page.properties) === null || _a === void 0 ? void 0 : _a.title) === null || _b === void 0 ? void 0 : _b.title) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.plain_text); }));
    });
    //@ts-ignore
    console.log('togglClients NAME:', (_d = (_c = togglClients === null || togglClients === void 0 ? void 0 : togglClients.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.name);
    console.log('differentWorkspacePages NAME:', 
    //@ts-ignore
    (_j = (_h = (_g = (_f = (_e = differentWorkspacePages === null || differentWorkspacePages === void 0 ? void 0 : differentWorkspacePages[0]) === null || _e === void 0 ? void 0 : _e.properties) === null || _f === void 0 ? void 0 : _f.title) === null || _g === void 0 ? void 0 : _g.title) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.plain_text);
    console.log('PAGES', differentWorkspacePages);
    if (!differentWorkspacePages) {
        return;
    }
    yield Promise.all(differentWorkspacePages.map((page) => __awaiter(void 0, void 0, void 0, function* () {
        var _k, _l, _m, _o;
        yield (0, togglHelper_1.togglHelper)({
            method: 'POST',
            endpoint: 'clients',
            data: {
                name: (_o = (_m = (_l = (_k = page === null || page === void 0 ? void 0 : page.properties) === null || _k === void 0 ? void 0 : _k.title) === null || _l === void 0 ? void 0 : _l.title) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.plain_text,
                wid: process.env.TOGGL_WORKSPACE_ID,
            },
        });
    })));
});
exports.createTogglClientsFromPages = createTogglClientsFromPages;
