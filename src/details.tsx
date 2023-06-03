import {Detail, List} from "@raycast/api";
import {useEffect, useState} from "react";
import puppeteer from "puppeteer";

interface State {
    items?: string[];
    error?: Error;
}

export default function main() {
    const [state, setState] = useState<State>({});

    useEffect(() => {
        async function fetchNews() {
            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();

            try {
                await page.goto('https://news.ycombinator.com/news');
                const news = await page.$$eval(
                    'tr.athing .title > .titleline > a',
                    links => links.map(link => link.textContent)
                );

                setState({items: news});
            } catch (error) {
                setState({
                    error: error instanceof Error ? error : new Error("Something went wrong"),
                });
            }
        }

        fetchNews();
    }, []);

    if (state.error != null) {
        return <Detail markdown={state.error.message}/>
    } else {
        return (
            <List isLoading={!state.items && !state.error}>
                {state?.items?.map((item, index) => (
                    <List.Item key={index} title={item}/>
                ))}
            </List>
        );
    }
}
