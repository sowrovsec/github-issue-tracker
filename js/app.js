
const API = 'https://phi-lab-server.vercel.app/api/v1/lab';
let allIssues = [];
// select all element from html 
const issuesContainer = document.getElementById('issues-container');
const issueCount = document.getElementById('issue-count');
const tabs = document.querySelectorAll('.tab-btn');
const spinner = document.getElementById('loading-spinner');

// Load Issues
const loadIssues = async () => {
    
    const res = await fetch(`${API}/issues`);
    const data = await res.json();
    allIssues = data.data;
    renderIssues(allIssues);
};
// display all issue 
const renderIssues = issues => {
    issuesContainer.innerHTML = '';
    issueCount.innerText = issues.length;

    issues.forEach(issue => {
        const isOpen = issue.status.toLowerCase() === 'open';
        const labels = issue.labels.map(l =>
            `<span class="badge ${l === 'bug' ? 'badge-error' : 'badge-outline'} text-xs">${l}</span>`
        ).join('');

        const card = document.createElement('div');
        card.className = `card bg-white-100 shadow-lg border-t-4 border-l border-r border-b border-gray-100 ${isOpen ? 'border-t-green-500' : 'border-t-purple-500'} cursor-pointer hover:shadow-xl`;
        card.innerHTML = `
            <div class="card-body p-5 flex flex-col h-full">
                <div class="flex justify-between items-start mb-2">
                    <img src="assets/${isOpen ? 'Open' : 'Closed'}-Status.png" class="w-4 h-4" alt="${issue.status}">
                    <span class="badge ${issue.priority.toLowerCase() === 'high' ? 'badge-error' : 'badge-warning'} badge-sm font-bold">${issue.priority.toUpperCase()}</span>
                </div>
                <h2 class="card-title text-lg font-bold line-clamp-2">${issue.title}</h2>
                <p class="text-sm text-gray-600 line-clamp-2 my-2 flex-grow">${issue.description}</p>
                <div class="flex gap-2 mb-4 flex-wrap">${labels}</div>
                <div class="flex justify-between items-center mt-auto border-t pt-3">
                    <div class="text-xs text-gray-500"><span class="font-bold">#${issue.id}</span> by ${issue.author}</div>
                    <div class="text-xs text-gray-500">${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                </div>
            </div>
        `;
       
        issuesContainer.appendChild(card);
    });
};

// Tabs Filter toggle  functionalities
tabs.forEach(btn => btn.onclick = () => {
    tabs.forEach(t => {
        t.classList.remove('bg-blue-600', 'text-white', 'shadow-md');
        t.classList.add('bg-white', 'text-gray-700', 'shadow-sm', 'hover:bg-blue-50');
    });

    btn.classList.add('bg-blue-600', 'text-white', 'shadow-md');
    btn.classList.remove('bg-white', 'text-gray-700', 'shadow-sm', 'hover:bg-blue-50');

    const status = btn.dataset.status.toLowerCase();
    renderIssues(status === 'all' ? allIssues : allIssues.filter(i => i.status.toLowerCase() === status));
});