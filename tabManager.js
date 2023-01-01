// todo move to settings to chrome extension settings
const tabsInfo = [
    {
        "url": "https://mail.google.com/mail/u/1/#inbox",
        "pinned": true,
        "group": false
    },
    {
        "url": "https://calendar.google.com/calendar/u/1/r",
        "pinned": true,
        "group": false
    }
];

async function closeAllPinnedTabs() {
    const tabs = await chrome.tabs.query({pinned: true});
    console.log(tabs);
    tabs.forEach(tab => {
        chrome.tabs.remove(tab.id);
    });
}

chrome.runtime.onStartup.addListener(async () => {
    await closeAllPinnedTabs();

    const tabIds = new Array();
    await Promise.all(tabsInfo.map(async (tabInfo, index) => {
        const tab = await chrome.tabs.create({ 
            index,
            url: tabInfo.url,
            pinned: tabInfo.pinned
         });

         if(tabInfo.group) {
            tabIds.push(tab.id)
         }
    }));
    
    // todo add support for multiple groups
    chrome.tabs.group({
        tabIds: tabIds
    });
  });