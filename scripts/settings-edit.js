// ===================== SELECTORS =====================
const selectors = {
    stateJson: '#state',
    emptyState: '.formula-container',
    formulaTable: '.formula-table',
    formulaList: '.table-list',
    formulaTemplate: '.formulaTemplateElem',
    formulaName: '.formula-name',
    formulaRemoveButton: '.remove',
    editButton: '.editbt',
    save: '.save',
    discard: '.discard',
    settingTitleInput: '.settingTitleInput'
};

// ===================== LOAD STATE =====================
const initialState = document.querySelector(selectors.stateJson).textContent;
const state = JSON.parse(initialState);

// берeмо settings (або вибери індекс, який треба)
const currentSetting = state.settings[0];


// ===================== REMOVE FORMULA =====================
function removeFormulaHandler(formulaElement, formulaId) {
    formulaElement.remove();

    const index = currentSetting.formulas.findIndex(f => f.id === formulaId);
    if (index > -1) currentSetting.formulas.splice(index, 1);

    toggleEmptyState();
}


// ===================== RENDER FORMULA ROW =====================
function renderFormulaElement(formula) {
    const template = document.querySelector(selectors.formulaTemplate);
    if (!template) return;

    const copy = template.cloneNode(true);
    copy.classList.remove('hidden');
    copy.id = `formula-${formula.id}`;

    // назва + лінк
    const nameElem = copy.querySelector(selectors.formulaName);
    nameElem.innerText = formula.title;
    nameElem.href = `formula.html?id=${formula.id}`;

    // EDIT
    const editBtn = copy.querySelector(selectors.editButton);
    editBtn.onclick = () => {
        window.location.href = `formula.html?id=${formula.id}`;
    };

    // DELETE
    const removeBtn = copy.querySelector(selectors.formulaRemoveButton);
    removeBtn.onclick = () => removeFormulaHandler(copy, formula.id);

    document.querySelector(selectors.formulaList).appendChild(copy);
}


// ===================== EMPTY STATE =====================
function toggleEmptyState() {
    const empty = document.querySelector(selectors.emptyState);
    const table = document.querySelector(selectors.formulaTable);

    if (currentSetting.formulas.length === 0) {
        table.classList.add('hidden');
        empty.classList.remove('hidden');
    } else {
        table.classList.remove('hidden');
        empty.classList.add('hidden');
    }
}


// ===================== INITIAL RENDER =====================
toggleEmptyState();
currentSetting.formulas.forEach(f => renderFormulaElement(f));


// ===================== SAVE / DISCARD LOGIC =====================
const saveBtn = document.querySelector(selectors.save);
const discardBtn = document.querySelector(selectors.discard);
const titleInputEl = document.querySelector(selectors.settingTitleInput);

// оригінальна назва (міняється після Save)
let originalTitle = currentSetting.title;

// встановлюємо початкове значення
titleInputEl.value = originalTitle;

// перевірка чи змінилось поле
function updateActionButtons() {
    const changed = titleInputEl.value.trim() !== originalTitle.trim();

    saveBtn.classList.toggle("active", changed);
    discardBtn.classList.toggle("active", changed);
}

// реагуємо на друкування
titleInputEl.addEventListener("input", updateActionButtons);

// SAVE — зберігає зміни
saveBtn.addEventListener("click", () => {
    if (!saveBtn.classList.contains("active")) return;

    currentSetting.title = titleInputEl.value.trim();

    // обновлюємо "оригінальне" значення після збереження
    originalTitle = currentSetting.title;

    updateActionButtons();
});

// DISCARD — скасовує зміни
discardBtn.addEventListener("click", () => {
    if (!discardBtn.classList.contains("active")) return;

    titleInputEl.value = originalTitle;
    updateActionButtons();
});
