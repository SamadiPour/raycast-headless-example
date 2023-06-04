import {Clipboard, closeMainWindow, showHUD} from "@raycast/api";
import puppeteer from "puppeteer";
import {v4 as uuidv4} from 'uuid';
import {execa} from "execa";
import {tmpdir} from "os";

export default async function main() {
    await closeMainWindow();

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    try {
        await page.setViewport({width: 1280, height: 800});
        await page.goto('https://www.nytimes.com/');
        const downloadPath = tmpdir() + "/" + uuidv4() + ".png";
        await page.screenshot({path: downloadPath, fullPage: true, type: "png"});

        // with Execa
        // await execa(
        //     `osascript -e 'tell app "Finder" to set the clipboard to ( POSIX file "${downloadPath}" )'`,
        //     [],
        //     {shell: true}
        // );

        // with Raycast clipboard
        await Clipboard.copy({file: downloadPath});

        await showHUD('Screenshot copied to your clipboard.');
    } catch (err) {
        await showHUD('Failed to get a screenshot.');
    }

    await browser.close();
}