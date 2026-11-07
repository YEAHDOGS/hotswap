const vscode = require('vscode');
const { rankProjects } = require('./match');

const currentFolder = () => vscode.workspace.workspaceFolders?.[0]?.uri;

function projectsRoot() {
  const configured = vscode.workspace.getConfiguration('hotswap').get('projectsRoot');
  if (configured) return vscode.Uri.file(configured);
  const current = currentFolder();
  return current && vscode.Uri.joinPath(current, '..');
}

async function listProjects(root) {
  const current = currentFolder()?.path.toLowerCase();
  const entries = await vscode.workspace.fs.readDirectory(root);
  return entries
    .filter(([name, type]) => type & vscode.FileType.Directory && !name.startsWith('.'))
    .map(([name]) => name)
    .filter((name) => vscode.Uri.joinPath(root, name).path.toLowerCase() !== current)
    .sort((a, b) => a.localeCompare(b));
}

function openOptions() {
  const mode = vscode.workspace.getConfiguration('hotswap').get('windowMode');
  return mode === 'same' ? { forceReuseWindow: true } : { forceNewWindow: true };
}

async function swapProject() {
  const root = projectsRoot();
  if (!root) {
    vscode.window.showWarningMessage('Hotswap: open a folder or set hotswap.projectsRoot first.');
    return;
  }

  let names;
  try {
    names = await listProjects(root);
  } catch (err) {
    vscode.window.showErrorMessage(`Hotswap: could not read ${root.fsPath}: ${err.message}`);
    return;
  }

  // alwaysShow turns off VS Code's built-in filter, which would reject
  // "we are dogs" for "wearedogs" because of the spaces.
  const toItems = (list) => list.map((label) => ({ label, alwaysShow: true }));

  const picker = vscode.window.createQuickPick();
  picker.placeholder = `Type a project name in ${root.fsPath}`;
  picker.items = toItems(names);
  picker.onDidChangeValue((value) => {
    picker.items = toItems(rankProjects(names, value));
  });
  picker.onDidAccept(() => {
    // Enter can land before the list catches up with fast typing, leaving a
    // stale item active. Only trust the active item if it matches the input.
    const ranked = rankProjects(names, picker.value);
    const active = picker.activeItems[0]?.label;
    const target = ranked.includes(active) ? active : ranked[0];
    if (!target) return;
    picker.hide();
    vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.joinPath(root, target), openOptions());
  });
  picker.onDidHide(() => picker.dispose());
  picker.show();
}

function activate(context) {
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  status.command = 'hotswap.swap';
  status.text = `$(arrow-swap) ${vscode.workspace.name ?? 'Swap Project'}`;
  status.tooltip = 'Swap to another project';
  status.show();

  context.subscriptions.push(
    status,
    vscode.commands.registerCommand('hotswap.swap', swapProject),
  );
}

module.exports = { activate };
