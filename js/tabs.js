export class Tabs {
    constructor(tabsParent, tabButtons, tabsContent) {
        this.tabButtons = tabButtons;
        this.tabsContent = tabsContent;
        this.tabsParent = tabsParent;

        this.showTabContent();

        this.tabsParent.addEventListener('click', (e) => this.toggleTabs(e));
    }

    hideTabContent(Content, Buttons) {
        Content.forEach(item => {
            item.classList.remove('card_active');
        });

        Buttons.forEach(item => {
            item.classList.remove('button_active');
        });
    }

    showTabContent(i = 0) {
        this.tabsContent[i].classList.add('card_active');
        this.tabButtons[i].classList.add('button_active');
    }

    toggleTabs(e) {
        for (let i = 0; i < this.tabButtons.length; i++) {
            let button = this.tabButtons[i];
            let target = e.target;
            e.preventDefault();

            if (target && target === button && !button.classList.contains('button_active')) {
                this.hideTabContent(this.tabsContent, this.tabButtons);
                this.showTabContent(i);
            }

        }
    }
}



