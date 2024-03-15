window["snDrawCalendar"] = (() => {
    const monthShort={
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        uz: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']
    },
    monthFull = {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        uz: ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
    },
    weekDaysShort = {
         en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
         ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
         uz: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
    }
    const sn = {
        PARENT: '',
        DT_TARGET: '[class^="sn-dtpick-input"]',
        DT_CONTAINER: 'sn-dtpick-panel',
        D_PANEL: 'sn-date-panel',
        HIDE: 'sn-hide',
        D_HEAD: 'sn-date-head',
        D_BODY: 'sn-date-body',
        WEEKDAYS: 'sn-weekdays',
        DAYS_BODY: 'sn-dbody-days',
        T_PANEL: 'sn-time-panel',
        T_HEAD: 'sn-time-head',
        T_BODY: 'sn-time-body',
        FOOTER: 'sn-footer',
        T_CLICKED: 'sn-t-clicked',
        D_CLICKED: 'sn-d-clicked',
        TODAY: 'sn-today'
    };
    // static classnames. When changing also keep css in mind.
    function mainEngine(parentClassname){
        let today = new Date(),
            currentDT = {
                year: today.getFullYear(),
                month: today.getMonth(),
                day: today.getDate(),
                hour: today.getHours(),
                minute: today.getMinutes(),
                second: today.getSeconds()
            },
            visibleDT = {
                ...currentDT,
                monthsHead: currentDT.year,
                yearsHead: (currentDT.year - (currentDT.year % 10))
            },
            selectedDT = {
                ...currentDT
            }
        // Global date variable used within functions

        sn.PARENT = parentClassname

        const options = {
            date: true,
            time: false,
            lang: "en"
        }
        const UTILS = {
            setAttributes: (element, attributes = {}) => {
                try {
                    Object.keys(attributes).forEach(attribute => {
                        element.setAttribute(attribute, attributes[attribute])
                    })
                    return element
                } catch (error) {
                    return undefined
                }
            },
            createElement: function (tagName = "div", attributes = {}, innerContent) {
                try {
                    if (innerContent) {
                        const newElement = this.setAttributes(document.createElement(tagName), attributes)
                        newElement.textContent = innerContent
                        return newElement
                    } else {
                        return this.setAttributes(document.createElement(tagName), attributes)
                    }
                } catch (error) {
                    return undefined
                }
            },
            isOverTen: (number) => {
                return String(number).length < 2 ? '0' + number : number;
            },
            range: (start, end) => {
                let arr = []
                for (let i = start; i < end; i++) {
                    arr = [...arr, i]
                }
                return arr;
            },
            hide: (...elements) => {
                elements.forEach(el => {
                    el.classList.add(sn.HIDE)
                })
            },
            show: (...elements) => {
                elements.forEach(el => {
                    el.classList.remove(sn.HIDE)
                })
            },
            getElement: ({parent = document, selectors}) => {
                let res = [];
                selectors.forEach(selector =>{ 
                    res = [...res, parent.querySelector(selector)];
                });
                return res;
                
            }
        }
        // draw date panel
        function drawDPanel() {
            const dPanel = UTILS.createElement('div', {
                class: sn.D_PANEL
            })
            const dHead = UTILS.createElement("div", {
                class: sn.D_HEAD
            })
            dPanel.appendChild(dHead)

            dHead.appendChild(UTILS.createElement('div', {class: 'sn-dhead-full-title'}))
            dHead.appendChild(UTILS.createElement('div', {
                class: `sn-dhead-month-title ${sn.HIDE}`
            }))
            dHead.appendChild(UTILS.createElement('div', {class: `sn-dhead-year-title  ${sn.HIDE}`}))
            const controls = UTILS.createElement('div', {class: "sn-dhead-controls"})
            dHead.appendChild(controls)

            controls.appendChild(UTILS.createElement('div', {class:'sn-dhead-prev'}, "◀️"))
            controls.appendChild(UTILS.createElement('div', {class:'sn-dhead-next'}, "▶️"))

            const dBody = UTILS.createElement('div', {class: sn.D_BODY})
            dPanel.appendChild(dBody)

            const daysContainer = UTILS.createElement('div')
            const weekdays = UTILS.createElement('div', {class: sn.WEEKDAYS})
            daysContainer.appendChild(weekdays)
            const weekDayNames = weekDaysShort[options.lang]

            weekDayNames.forEach(day => {
                weekdays.appendChild(UTILS.createElement('p', {}, day))
            })

            daysContainer.appendChild(UTILS.createElement('div', {class: sn.DAYS_BODY}))

            dBody.appendChild(daysContainer)
            const dBodyMonths = UTILS.createElement('div', {class: `sn-dbody-months ${sn.HIDE}`})
            dBody.appendChild(dBodyMonths)
            dBody.appendChild(UTILS.createElement('div', {
                class: `sn-dbody-years ${sn.HIDE}`
            }))
            
            // Fill month panel
            monthShort[options.lang].forEach((e, idx) => {
                dBodyMonths.appendChild(UTILS.createElement("div", {month: idx}, `${e}`))
                
            })
            
            return dPanel
        }
        // draw time panel
        function drawTPanel() {
            const tPanel = UTILS.createElement('div', {
                class: sn.T_PANEL
            })

            const tHead = UTILS.createElement('div', {
                class: sn.T_HEAD
            })
            tPanel.appendChild(tHead)
            tHead.appendChild(UTILS.createElement('input', {
                class: "sn-hour-input",
                type: "text",
                maxlength: "2",
                "sn-target-list": 'hour'
            }))
            tHead.appendChild(UTILS.createElement('p', {}, ":"))
            tHead.appendChild(UTILS.createElement('input', {
                class: "sn-minute-input",
                type: "text",
                maxlength: "2",
                "sn-target-list": 'minute'
            }))
            tHead.appendChild(UTILS.createElement('p', {}, ":"))
            tHead.appendChild(UTILS.createElement('input', {
                class: "sn-second-input",
                type: "text",
                maxlength: "2",
                "sn-target-list": 'second'
            }))

            const tBody = UTILS.createElement('div', {
                class: sn.T_BODY
            })
            tPanel.appendChild(tBody)
            const tBodyHours = UTILS.createElement('ul', {class: 'sn-hours-list'}),
                tBodyMinutes = UTILS.createElement('ul', {class: 'sn-minutes-list'}),
                tBodySeconds = UTILS.createElement('ul', {class: 'sn-seconds-list'});

            tBody.appendChild(tBodyHours)
            tBody.appendChild(tBodyMinutes)
            tBody.appendChild(tBodySeconds)
            
            const {hour, minute, second} = selectedDT
            filler(tBodyHours, 24, hour)
            filler(tBodyMinutes, 60, minute)
            filler(tBodySeconds, 60, second)
            return tPanel
        }
        // draw footer
        function drawFooter() {
            const footer = UTILS.createElement("div", {
                class: sn.FOOTER
            })
            footer.appendChild(UTILS.createElement('div', {class: "sn-reset-btn"}, "now"))
            footer.appendChild(UTILS.createElement('div', {class: "sn-submit-btn"}, "submit"))
            return footer
        }
        // draw full calendar container
        function drawUI() {
            
            const {time, date} = options;

            let dtPanel = UTILS.createElement("div", {class: `${sn.DT_CONTAINER}`});
            if (date && time) {
                dtPanel.appendChild(drawDPanel())
                dtPanel.appendChild(drawTPanel())
            }else if (date) {
                dtPanel.appendChild(drawDPanel())
            };
            dtPanel.appendChild(drawFooter())
            document.querySelector(`.${sn.PARENT}`).appendChild(dtPanel)
            dtPickUpdate()
            if (time) {
                tUpdate()
            }
        }
        // capture and return necessary variables for later uses    
        function initEl(){
            const {date, time} = options
            if (date && !time) {
            const dtParent = document.querySelector("." + sn.PARENT),
                dtTarget = dtParent.querySelector(sn.DT_TARGET),
                dtPanel = dtParent.querySelector("." + sn.DT_CONTAINER),
                dPanel = dtPanel.querySelector(`.${sn.D_PANEL}`),
                dHead = dPanel.querySelector(`.${sn.D_HEAD}`),
                dBody = dPanel.querySelector(`.${sn.D_BODY}`),
                footer = dtParent.querySelector(`.${sn.FOOTER}`)
            return {dtParent, dtTarget, dtPanel, dPanel, dHead, dBody, footer}    
            }
            const dtParent = document.querySelector("." + sn.PARENT),
                dtTarget = dtParent.querySelector(sn.DT_TARGET),
                dtPanel = dtParent.querySelector("." + sn.DT_CONTAINER),
                dPanel = dtPanel.querySelector(`.${sn.D_PANEL}`),
                dHead = dPanel.querySelector(`.${sn.D_HEAD}`),
                dBody = dPanel.querySelector(`.${sn.D_BODY}`),
                tPanel = dtParent.querySelector(`.${sn.T_PANEL}`),
                tHead = tPanel.querySelector(`.${sn.T_HEAD}`),
                tHeadInputs = tHead.querySelectorAll('input'),
                tBody = tPanel.querySelector(`.${sn.T_BODY}`),
                tBodyLists = tBody.querySelectorAll('ul'),
                footer = dtParent.querySelector(`.${sn.FOOTER}`)
            return {dtParent, dtTarget, dtPanel, dPanel, dHead, dBody, tPanel, tHead, tHeadInputs, tBody, footer, tBodyLists}
        }
        
        // Fill year panel with years in necessary range
        function yearsPanelFiller(config = false){
            const {dHead, dBody} = initEl(),
                {yearsHead} = visibleDT,
                dBodyYears = dBody.querySelector('.sn-dbody-years');
            dHead.querySelector('.sn-dhead-year-title').textContent = `${yearsHead}-${yearsHead+11}`
            if (config) {
                UTILS.show(dBodyYears)
            }
            dBodyYears.replaceChildren(
                ...UTILS.range(yearsHead, yearsHead + 12).map(e => UTILS.createElement("div", {
                    year: e
                }, `${e}`))
            )
        }
        // Update time body active times and set value to input area
        function tUpdate() {
            const {tHead, tBody} = initEl(),
                {hour, minute, second} = selectedDT,
                [hourInput, minuteInput, secondInput] = UTILS.getElement({
                    parent: tHead, 
                    selectors: ['.sn-hour-input', '.sn-minute-input', '.sn-second-input']
                }),
                [hoursList, minutesList, secondsList] = UTILS.getElement({
                    parent: tBody,
                    selectors: ['.sn-hours-list', '.sn-minutes-list', '.sn-seconds-list']
                });

            hourInput.value = UTILS.isOverTen(hour)
            minuteInput.value = UTILS.isOverTen(minute)
            secondInput.value = UTILS.isOverTen(second);

            [hoursList, secondsList, minutesList].forEach((list)=>{
                list.childNodes.forEach(li => li.classList.remove(sn.T_CLICKED))
            });

            hoursList.childNodes[Number(hour)].classList.add(sn.T_CLICKED);
            minutesList.childNodes[Number(minute)].classList.add(sn.T_CLICKED);
            secondsList.childNodes[Number(second)].classList.add(sn.T_CLICKED);
        }
        // set targeted input area value e.g 13.02.2023, 16:41:22
        function dtTargetSet(date = today) {
            const {time} = options
            if (time) {
                initEl().dtTarget.value = (date.toLocaleString("en-GB").replaceAll('/', '.')).replaceAll(',', '')
            }else{
                initEl().dtTarget.value = date.toLocaleDateString("en-GB").replaceAll('/', '.')
            }
        }
        // time column filler
        function filler(parent, count, selectedIdx) { // amount - count
            let elemenList = []
            for (let i = 0; i < count; i++) {
                elemenList = [...elemenList, UTILS.createElement('li', {}, UTILS.isOverTen(i))]
            }
            elemenList[Number(selectedIdx)].classList.add(sn.T_CLICKED)
            parent.replaceChildren(...elemenList)
        }
        // return an array of html elements for days container. used together with dBodyDaysFill func.
        function dayListGenerate(daysNumArray, classname, monthIdx){
            let daysEleList = []
            daysNumArray.forEach((dayNum) => {
                const year = new Date(visibleDT.year, monthIdx, dayNum).getFullYear(),
                    month = new Date(visibleDT.year, monthIdx, dayNum).getMonth(),
                    day = dayNum,
                    newElement = (() => UTILS.createElement('div', {
                        class: classname,
                        year,
                        month,
                        day
                    }, `${dayNum}`))()
                if (year === selectedDT.year && month === selectedDT.month && day === selectedDT.day) {
                    newElement.classList.add(sn.D_CLICKED)
                }
                
                if (year === currentDT.year && month === currentDT.month && day === currentDT.day) {
                    newElement.classList.add(sn.TODAY)
                }
                daysEleList = [...daysEleList, newElement];
            })

            return daysEleList
        }
        // create and return a full html element list for days container
        function dBodyDaysFill(prevDays, presDays, startWeekday){
            let prevDaysArr = UTILS.range(prevDays - (startWeekday - 1), prevDays + 1),
                presDaysArr = UTILS.range(1, presDays + 1),
                nextDaysArr = UTILS.range(1, 42 - (presDaysArr.length + prevDaysArr.length) + 1)
            return [...dayListGenerate(prevDaysArr, "", visibleDT.month - 1), ...dayListGenerate(presDaysArr, "sn-active", visibleDT.month), ...dayListGenerate(nextDaysArr, "", visibleDT.month + 1)];
        }
        
        function dPanelEvents(){
            const {dtPanel, dHead, dBody} = initEl();
            const dHeadFull = dHead.querySelector('.sn-dhead-full-title'),
                dHeadMonth = dHead.querySelector('.sn-dhead-month-title'),
                dHeadYear = dHead.querySelector('.sn-dhead-year-title'),
                prevBtn = dHead.querySelector('.sn-dhead-prev'),
                nextBtn = dHead.querySelector('.sn-dhead-next'),
                dBodyDays = dBody.querySelector('.sn-dbody-days'),
                dBodyMonth = dBody.querySelector('.sn-dbody-months'),
                dBodyYears = dBody.querySelector('.sn-dbody-years');

            dHeadFull.addEventListener("click", () => {
                visibleDT.monthsHead = visibleDT.year
                UTILS.hide(dHeadFull)
                UTILS.show(dBodyMonth, dHeadMonth)
                dtPickUpdate()
            })

            dHeadMonth.addEventListener("click", () => {
                const {monthsHead} = visibleDT
                UTILS.hide(dHeadMonth)
                UTILS.show(dHeadYear)
                visibleDT.yearsHead = monthsHead - monthsHead % 10
                yearsPanelFiller(true)
            })
 
            dBodyMonth.addEventListener('click', (e) => {
                if (dBodyMonth.contains(e.target) && dBodyMonth != e.target) {
                    visibleDT.year = visibleDT.monthsHead
                    visibleDT.month = Number(e.target.getAttribute('month'));
                    UTILS.hide(dBodyMonth, dHeadMonth)
                    UTILS.show(dHeadFull)
                    dtPickUpdate()
                }
            })

            dBodyYears.addEventListener('click', (e) => {
                if(dBodyYears.contains(e.target) && dBodyYears !==e.target){
                    UTILS.hide(dBodyYears, dHeadYear)
                    UTILS.show(dHeadMonth)
                    visibleDT.monthsHead = Number(e.target.getAttribute('year'))
                    dtPickUpdate()
                }
            })

            // PREV BTN
            prevBtn.addEventListener("click", () => {
                visibleDT.monthsHead--
                visibleDT.yearsHead -= 10

                visibleDT.month - 1 < 0 ? (() => {
                    visibleDT.month = 11;
                    visibleDT.year--;
                })() : (() => {
                    visibleDT.month--;
                })()

                yearsPanelFiller()
                dtPickUpdate()
            })
            // NEXT BTN
            nextBtn.addEventListener("click", () => {
                visibleDT.monthsHead++
                visibleDT.yearsHead += 10

                visibleDT.month + 1 > 11 ? (() => {
                    visibleDT.month = 0;
                    visibleDT.year++;
                })() : (() => {
                    visibleDT.month++;
                })()

                yearsPanelFiller()
                dtPickUpdate()
            })

            dBodyDays.addEventListener("dblclick", () => UTILS.hide(dtPanel))

            dBodyDays.addEventListener("click", (e) => {
                if (dBodyDays.contains(e.target) && dBodyDays != e.target) {
                    dBodyDays.childNodes.forEach(day => {
                        day.classList.remove(sn.D_CLICKED)
                    })
                    selectedDT.day = Number(e.target.textContent)
                    visibleDT.year = Number(e.target.getAttribute("year"))
                    selectedDT.year = visibleDT.year

                    if (visibleDT.month != Number(e.target.getAttribute("month"))) {
                        visibleDT.month = Number(e.target.getAttribute("month"))
                        selectedDT.month = visibleDT.month
                        dtPickUpdate()
                    } else {
                        e.target.classList.add(sn.D_CLICKED)
                        selectedDT.month = visibleDT.month
                    }
                    dtTargetSet(new Date(...Object.values(selectedDT)))
                }
            })        
        }

        function tPanelEvents(){
            const {tHeadInputs, tBody, tHead} = initEl(),
            [hourInput, minuteInput, secondInput] = UTILS.getElement({
                parent: tHead, 
                selectors: ['.sn-hour-input', '.sn-minute-input', '.sn-second-input']
            }),
            [hoursList, minutesList, secondsList] = UTILS.getElement({
                parent: tBody,
                selectors: ['.sn-hours-list', '.sn-minutes-list', '.sn-seconds-list']
            });
            tHeadInputs.forEach((inputField, idx) => {
                const timeLimit={
                    hour:24,
                    minute:60,
                    second:60
                },
                target = inputField.getAttribute('sn-target-list');
                
                inputField.addEventListener('keydown', (e) => {
                    const {selectionStart, selectionEnd, value} = inputField,
                        {key} = e,
                        keysArr = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
                    if (!(/\d+/.test(key)) && !keysArr.includes(key)) {
                        e.preventDefault()
                    } else if ((value.length == 0 && idx != 0 && key == keysArr[0]) || (key == keysArr[2] && idx != 0 && selectionStart == 0 && selectionEnd == 0)) {
                        e.preventDefault()
                        tHeadInputs[idx - 1].focus()
                    } else if (key == keysArr[3] && idx != tHeadInputs.length - 1 && selectionStart == value.length && selectionEnd == value.length) {
                        e.preventDefault()
                        tHeadInputs[idx + 1].focus()
                    }
                })
        
                inputField.addEventListener('keyup', (e) => {
                    const {selectionStart, selectionEnd, value} = inputField
                    if (value.length == 2  && /\d+/.test(e.key) && selectionStart == 2 && selectionEnd == 2) {
                        tHeadInputs[(idx+1)%3].select()
                    }
        
                })

                inputField.addEventListener('focusout', () => {
                    let {value} = inputField;
                    value = value.length < 2 ? '0' + value : value;
                    value = Number(value) >= 0 ? (value < timeLimit[target] ? value : timeLimit[target] - 1) : '00';
                    selectedDT[target] = value
                    switch (target) {
                        case "hour":
                            hoursList.querySelectorAll("li").forEach(li => {
                                li.className = ""
                            })
                            hoursList.childNodes[Number(value)].className = sn.T_CLICKED
                            hoursList.scrollTo({
                                top: 28*value,
                                behavior: "smooth"
                            })
                            break;
                        case "minute":
                            minutesList.querySelectorAll("li").forEach(li => {
                                li.className = ""
                            })
                            minutesList.childNodes[Number(value)].className = sn.T_CLICKED
                            minutesList.scrollTo({
                                top: 28*value,
                                behavior: "smooth"
                            })
                            break;
                        case "second":
                            secondsList.querySelectorAll("li").forEach(li => {
                                li.className = ""
                            })
                            secondsList.childNodes[Number(value)].classList.add(sn.T_CLICKED)
                            secondsList.scrollTo({
                                top: 28*value,
                                behavior: "smooth"
                            })
                            break;
                        default:
                            break;  
                    }
                    inputField.value = UTILS.isOverTen(value)
                    dtTargetSet(new Date(...Object.values(selectedDT)))
                })
        
            });

            tBody.addEventListener('click', (e) => {
                if (tBody.contains(e.target) && tBody !== e.target) {
                    switch (e.target.parentElement) {
                        case hoursList:
                            selectedDT.hour = Number(e.target.textContent)
                            hourInput.value = e.target.textContent
                            break;
                        case minutesList:
                            selectedDT.minute = Number(e.target.textContent)
                            minuteInput.value = e.target.textContent
                            break;
                        case secondsList:
                            selectedDT.second = Number(e.target.textContent)
                            secondInput.value = e.target.textContent
                            break;
                        default:
                            break;
                    }
                    e.target.parentElement.childNodes.forEach(child => {child.classList.remove(sn.T_CLICKED)})
                    e.target.classList.add(sn.T_CLICKED)
                    dtTargetSet(new Date(...Object.values(selectedDT)))
                     
                    e.target.parentElement.scrollTo({
                        top: Number(e.target.textContent)*28,
                        left: 0,
                        behavior: "smooth"  
                    })
                   
                }
            })

        }

        function footerEvents(){
            const {dtPanel, dBody, dHead, footer} = initEl()
            const resetBtn = footer.querySelector('.sn-reset-btn'),
                submitBtn = footer.querySelector('.sn-submit-btn');
            resetBtn.addEventListener('click', () => {
                const newDate = new Date(),
                    {year, month} = currentDT;
            
                visibleDT = {...visibleDT, year, month}
                selectedDT = {...currentDT, hour: newDate.getHours(), minute: newDate.getMinutes(), second: newDate.getSeconds()}
                tUpdate()
                dtTargetSet(newDate)
                dtPickUpdate(year, month)
                UTILS.hide(...UTILS.getElement({
                    parent: dHead,
                    selectors: [".sn-dhead-year-title", ".sn-dhead-month-title"]
                }), ...UTILS.getElement({
                    parent: dBody,
                    selectors: [".sn-dbody-months", ".sn-dbody-years"]
                }))
                UTILS.show(...UTILS.getElement({parent: dHead, selectors: ['.sn-dhead-full-title']}))
            })

            submitBtn.addEventListener("click", () => {
                document.querySelectorAll(`.${sn.DT_CONTAINER}`).forEach(element =>{
                    element.remove()
            })
            });        
        }

        const attachEvents = ()=>{
            
            const {time, date} = options
            const {dtTarget, dtPanel} = initEl()
            dtTarget.addEventListener("keydown", (e) => e.preventDefault())
            dtPanel.addEventListener("click", (e) =>{
                e.stopPropagation()
            })
            
            if (date && time) {
                dPanelEvents()
                tPanelEvents()    
            }else if (date) {
                dPanelEvents()
            }
            footerEvents()
        }
        // main function for setting active and selected date time values on main panel
        function dtPickUpdate(year = visibleDT.year, month = visibleDT.month){
            const {dHead, dBody} = initEl()
            let presMonth = new Date(year, month + 1, 0),
                prevMonth = new Date(year, month, 0),
                presMonthDays = presMonth.getDate(),
                prevMonthDays = prevMonth.getDate(),
                startWeekDay = ((new Date(year, month, 1)).getDay() + 6) % 7,
                title = presMonth.toLocaleString(options.lang, {
                    year: "numeric",
                    month: "long"
                });
            dHead.querySelector('.sn-dhead-full-title').textContent = `${monthFull[options.lang][month]} ${year}`;
            dHead.querySelector('.sn-dhead-month-title').textContent = visibleDT.monthsHead
            dBody.querySelector('.sn-dbody-days').replaceChildren(...dBodyDaysFill(prevMonthDays, presMonthDays, startWeekDay))
        }
        
        (()=>{
            const dtTarget = document.querySelector(`.${sn.PARENT}`).querySelector(`${sn.DT_TARGET}`);
                if (dtTarget.className.includes('datetime')) {
                    options.time = true;
                    options.date = true;
                }else if(dtTarget.className.includes('date')){
                    options.date = true;
                    options.time = false;
                }else{
                    options.time = true;
                    options.date = true;
                };
                if (dtTarget.getAttribute('lang') && Object.keys(monthFull).includes(dtTarget.getAttribute('lang'))) {
                    options.lang = dtTarget.getAttribute('lang')
                }else{
                    options.lang = "en"
                }
                if (dtTarget.value) {
                    if (dtTarget.value.includes(':')) {
                        let [date, time] = dtTarget.value.split(' ');
                        date = date.split('.');
                        time = time.split(':');
                        selectedDT.day = Number(date[0])
                        selectedDT.month = Number(date[1]) - 1;
                        selectedDT.year = Number(date[2])
                        selectedDT.hour = Number(time[0])
                        selectedDT.minute = Number(time[1])
                        selectedDT.second = Number(time[2])
                    }else{
                        date = dtTarget.value.split('.');
                        selectedDT.day = Number(date[0])
                        selectedDT.month = Number(date[1]) - 1;
                        selectedDT.year = Number(date[2])
                    }

                    visibleDT = {
                        ...selectedDT, 
                        monthsHead: selectedDT.year,
                        yearsHead: (selectedDT.year - (selectedDT.year % 10))
                }
                }
        })()
        drawUI()
        attachEvents()
    }   

    return (function(){
        document.querySelectorAll('[class^="sn-dtpick-parent"]').forEach((el, idx) => {
            const dtTarget = el.querySelector(`${sn.DT_TARGET}`);
            el.className = "sn-dtpick-parent"+`-${idx}`
            
            dtTarget.addEventListener("click", (e) =>{
                e.stopPropagation()
                document.querySelectorAll(`.${sn.DT_CONTAINER}`).forEach(element =>{
                        element.remove()
                })
                mainEngine(el.className)
            })
            
            document.addEventListener('click', (e) => {
                document.querySelectorAll(`.${sn.DT_CONTAINER}`).forEach(element =>{
                    element.remove()
                })
            })  
        })
        return arguments.callee
    })()

})(window)


window.addEventListener('load', ()=>{
    let maincontainer = document.createElement("div"),
        dtParent = document.createElement('div'),
        dtTarget = document.createElement('input');
        maincontainer.className = "calendar-input-container";
        dtParent.className = "sn-dtpick-parent";
        dtTarget.className = "sn-dtpick-input-datetime";
        dtTarget.setAttribute('placeholder', "Select date");
        dtTarget.setAttribute('lang', "ru");
        dtParent.appendChild(dtTarget)
        maincontainer.appendChild(dtParent);
        document.body.appendChild(maincontainer);

    snDrawCalendar()    
})