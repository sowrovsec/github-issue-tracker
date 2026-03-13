
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
        card.onclick = () => openModal(issue);
        issuesContainer.appendChild(card);
    });
};

// Tabs  toggle  functionalities
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

// Modal functinalities
const openModal = async issueSummary => {
    const modal = document.getElementById('issue_modal');
    const modalContent = document.getElementById('modal-content');

    const res = await fetch(`${API}/issue/${issueSummary.id}`);
    const fullIssue = (await res.json()).data;

    const isOpen = fullIssue.status.toLowerCase() === 'open';
    const statusBg = isOpen ? 'bg-emerald-500' : 'bg-purple-500';
    const statusText = isOpen ? 'Opened' : 'Closed';
    const priorityBadge = fullIssue.priority.toLowerCase() === 'high' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white';
    const date = fullIssue.createdAt ? new Date(fullIssue.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

    const labelsHtml = fullIssue.labels.map(label => {
        const isBug = label.toLowerCase() === 'bug';
        return `<span class="flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${isBug ? 'text-red-500 border-red-200 bg-red-50' : 'text-yellow-600 border-yellow-200 bg-yellow-50'} uppercase">${label}</span>`;
    }).join('');

    modalContent.innerHTML = `
        <div class="mb-6">
            <h3 class="font-bold text-2xl mb-3 text-slate-800">${fullIssue.title}</h3>
            <div class="flex items-center text-sm text-gray-500 gap-2">
                <span class="${statusBg} text-white px-3 py-0.5 rounded-full text-xs font-medium">${statusText}</span>
                <span>•</span>
                <span>Opened by ${fullIssue.author}</span>
                <span>•</span>
                <span>${date}</span>
            </div>
        </div>
        <div class="flex gap-2 mb-6">${labelsHtml}</div>
        <p class="text-gray-600 mb-8 text-sm leading-relaxed">${fullIssue.description}</p>
        <div class="bg-slate-50 rounded-xl p-6 flex flex-col sm:flex-row gap-8 sm:gap-24 mb-6">
            <div>
                <p class="text-gray-500 text-sm mb-1">Assignee:</p>
                <p class="font-bold text-slate-800">${fullIssue.assignee}</p>
            </div>
            <div>
                <p class="text-gray-500 text-sm mb-1">Priority:</p>
                <span class="${priorityBadge} px-3 py-0.5 rounded-full text-xs font-medium uppercase">${fullIssue.priority}</span>
            </div>
        </div>
        <div class="flex justify-end mt-6">
            <form method="dialog">
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors">Close</button>
            </form>
        </div>
    `;
    modal.showModal();
};

loadIssues();