const options = {
    'lives': {
        id: 'lives',
        label: 'Lives',
        type: 'number',
        unit: 'number',
        value: 3,
        min: 1,
        max: 10,
        step: 1,
    },
    'initialTargetTimer': {
        id: 'initialTargetTimer',
        label: 'Target Timer',
        type: 'number',
        unit: 'ms',
        value: 1500,
        min: 500,
        max: 3000,
        step: 100,
    },
    'fakeTargetTimer': {
        id: 'fakeTargetTimer',
        label: 'Fake Timer',
        type: 'number',
        unit: 'ms',
        value: 500,
        min: 100,
        max: 1000,
        step: 50,
    },
    'approvalTimer': {
        id: 'approvalTimer',
        label: 'Approval Timer',
        type: 'number',
        unit: 'ms',
        value: 500,
        min: 100,
        max: 1500,
        step: 100,
    },
    'perLevelPointsLimit': {
        id: 'perLevelPointsLimit',
        label: 'Points Limit',
        type: 'number',
        unit: 'number',
        value: 150,
        min: 15,
        max: 1500,
        step: 5,
    },
    'perLevelTimeReduction': {
        id: 'perLevelTimeReduction',
        label: 'Time Reduction',
        type: 'number',
        unit: 'ms',
        value: 250,
        min: 100,
        max: 500,
        step: 50,
    },
};

let optionsDiv = document.querySelector('.options');

for (let option of Object.values(options)) {
    let optionDiv = document.createElement('div');
    let label = document.createElement('label');
    let inputContainer = document.createElement('div');
    let input = document.createElement('input');

    optionDiv.className = 'option';
    label.innerText = `${option.label} (${option.unit}):`;
    input.id = option.id;
    input.name = option.id;
    input.type = option.type;
    input.value = option.value;
    input.step = option.step;
    input.min = option.min;
    input.max = option.max;
    input.onchange = () => {
        option.value = parseInt(input.value);
    };

    optionsDiv.appendChild(optionDiv);
    optionDiv.appendChild(label);
    optionDiv.appendChild(inputContainer);
    inputContainer.appendChild(input);
}
