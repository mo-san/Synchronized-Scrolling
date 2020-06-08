// To ignore alerts saying "no property 'id' in TextEditor", which there really is on runtime,
// append `id: string` under the interface `TextEditor` in `node_modules\@types\vscode\index.d.ts`.

import { window, commands, ExtensionContext, TextEditor, TextEditorRevealType, Range, workspace, Position, TextDocument } from 'vscode';

const showDebugMessage = (...msg: any) => window.showInformationMessage(JSON.stringify(msg));

/**
 * How long this extension should wait for scrolling to become still in milliseconds.
 * I couldn't find out another nice solution to detect the end of moving.
 */
const msecScrollEnd: number = 300;

/**
 * If another instance of scrolling comes in before this time limit, it will be discarded.
 */
let waitUntil: number = Date.now();
const backOffFactor: number = 600;

/**
 * Whether this extension is enabled. If false, this does not synchronize scrolling.
 */
let isExtensionEnabled: boolean = workspace.getConfiguration("synchronizedScrolling").get<boolean>("automaticallyEnabled", true);

/**
 * This extension will try to align the top lines in all editors ...
 * by line number if `true`, by ratio to whole document if `false`.
 */
let revealByLineNumber: boolean = false;

/**
 * `InCenter`: The range will always be revealed in the center of the viewport.
 * `AtTop`: The range will always be revealed at the top of the viewport.
 */
let revealType: TextEditorRevealType.AtTop | TextEditorRevealType.InCenter = TextEditorRevealType.AtTop;

/**
 * Event listener
 */
const visibleRangeChanged = () => window.onDidChangeTextEditorVisibleRanges(TextEditorVisibleRangesChangeEvent => {
    if (!isExtensionEnabled) { return }
    if (window.visibleTextEditors.length < 2) { return }
    if (!window.activeTextEditor) { return }
    if (waitUntil > Date.now()) { return };

    const editorScrolled = TextEditorVisibleRangesChangeEvent.textEditor;
    waitUntil = Date.now() + backOffFactor;
    setTimeout(() => {
        window.visibleTextEditors
            .filter(editor => editor.id !== editorScrolled.id)
            .map(editor => editor.revealRange(getRangeToReveal(editorScrolled, editor), revealType));
    } , msecScrollEnd);
});

/**
 * returns a Range which has the number of top line to be revealed.
 * @param editorSource A TextEditor which scroll event was fired upon.
 * @param editorOther TextEditors other than the source.
 */
function getRangeToReveal(editorSource: TextEditor, editorOther: TextEditor): Range {
    if (revealByLineNumber) {
        if (revealType === TextEditorRevealType.AtTop) {
            return editorSource.visibleRanges[0];
        } else {
            return editorSource.visibleRanges[0];
        }
    } else {
        function _makeRange(source: TextDocument, other: TextDocument): Range {
            const visibleRange = editorSource.visibleRanges[0];
            let target: number;
            if (revealType === TextEditorRevealType.AtTop) {
                target = source.offsetAt(editorSource.visibleRanges[0].start);
            } else {
                target = Math.round((source.offsetAt(visibleRange.start) + source.offsetAt(visibleRange.end)) / 2);
            }
            const ratio = target / source.offsetAt(new Position(source.lineCount + 1, 0));
            const posTop = other.positionAt(ratio * other.offsetAt(new Position(other.lineCount + 1, 0)));
            return new Range(posTop, posTop);
        }
        return _makeRange(editorSource.document, editorOther.document);
    }
}

function toggleSynchronizedScrolling(): void {
    isExtensionEnabled = !isExtensionEnabled;
    window.showInformationMessage(`Synchronized Scrolling is now ${isExtensionEnabled ? "Enabled" : "Disabled"}!`);
}

/**
 * will be run on this extension's activation
 * @param context
 */
export function activate(context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand("synchronizedScrolling.toggleSynchronizedScrolling", () => toggleSynchronizedScrolling()));

    // an event fired when multiple editors are opened
    window.onDidChangeVisibleTextEditors(visibleRangeChanged);
    // if there are multiple editors already on startup
    if (window.visibleTextEditors.length > 1) { visibleRangeChanged() };
}

export function deactivate() { }
