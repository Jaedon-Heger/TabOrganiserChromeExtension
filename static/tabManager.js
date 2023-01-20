// todo move to settings to chrome extension settings in #2
const tabsInfo = [
    {
        "url": "https://mail.google.com/mail/u/1/#inbox",
        "pinned": true
    },
    {
        "url": "https://calendar.google.com/calendar/u/1/r",
        "pinned": true
    },
    {
        "url": "https://mail.google.com/mail/u/0/#inbox",
        "pinned": true,
        "group": 1
    },
    {
        "url": "https://calendar.google.com/calendar/u/0/r",
        "pinned": true,
        "group": 2
    },
    {
        "url": "chrome://extensions/",
        "pinned": true,
        "group": 2
    },
];

function getGroupMapFromEntries(groupEntries) {
    // code from https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
    return groupEntries.reduce((groupObect, groupInfo) => {
        (groupObect[groupInfo.groupId] = groupObect[groupInfo.groupId] || []).push(groupInfo.tabId);
        return groupObect;
      }, {});
}

async function closeAllPinnedTabs() {
    const tabs = await chrome.tabs.query({pinned: true});

    tabs.forEach(tab => {
        chrome.tabs.remove(tab.id);
    });
}

chrome.runtime.onStartup.addListener(async () => {
    await closeAllPinnedTabs();

    const groupEntries = new Array();

    await Promise.all(tabsInfo.map(async (tabInfo, index) => {
        const tab = await chrome.tabs.create({ 
            index,
            url: tabInfo.url,
            pinned: tabInfo.pinned
         });

         if(tabInfo.group) {
            groupEntries.push({
                groupId: tabInfo.group,
                tabId: tab.id
            });
         }
    }));

    const groupMap = getGroupMapFromEntries(groupEntries);

    Object.values(groupMap).reverse().forEach(tabIds => {
        chrome.tabs.group({
            tabIds: tabIds
        });
    });
  });