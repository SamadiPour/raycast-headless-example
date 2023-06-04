import { showToast, Toast, updateCommandMetadata } from "@raycast/api";
import puppeteer from "puppeteer";

export default async function main() {
  const toast = await showToast({
    style: Toast.Style.Animated,
    title: "Fetching info",
  });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://news.ycombinator.com/news");
    const name = await page.$eval(".hnname > a", (el) => el.innerText);

    toast.style = Toast.Style.Success;
    toast.title = "Information Fetched";

    await updateCommandMetadata({ subtitle: name });
  } catch (err) {
    toast.style = Toast.Style.Failure;
    toast.title = "Failed to fetch info";
    if (err instanceof Error) {
      toast.message = err.message;
    }
  }

  await browser.close();
}
