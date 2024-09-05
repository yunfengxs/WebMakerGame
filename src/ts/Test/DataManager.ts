import '../../css/test.css'
import {CreateElementWithClasses} from "../Utils/HtmlUtils";
import {HttpClient} from "./HttpClient";
export class DataManager{
    table_list = ['father', 'child']
    modal:HTMLElement | undefined;
    addButton = document.getElementById('addButton') as HTMLButtonElement;
    itemContainer = document.getElementById('itemContainer') as HTMLDivElement;
    tagContainer = document.getElementById('tagContainer') as HTMLDivElement;
    openModalButton = document.getElementById('openModalButton') as HTMLButtonElement;
    closeModal = document.getElementById('closeModal') as HTMLSpanElement;
    contentContainer = document.getElementById('contentContainer') as HTMLDivElement;

    constructor() {
        this.modal = document.getElementById('modal') as HTMLElement;
        //this.table_list = table_list;

        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                // @ts-ignore
                this.modal.style.display = 'none';
            }
        });
        this.closeModal.addEventListener('click', (event) => {
            this.closeDatasPage()
        })
    }
    // 初始化标签
    initializeTags() {
        this.tagContainer.innerHTML = '';
        this.table_list.forEach(item => {
            let tag = CreateElementWithClasses('div',item,this.tagContainer,['tag'])
            CreateElementWithClasses('div','',tag,['tag-actions'])
            tag.addEventListener('click', () => {
                this.contentContainer.innerHTML = '';
                let add = CreateElementWithClasses('div','add',this.contentContainer,['tag'])
                add.addEventListener('click',()=>{
                    const apiClient = new HttpClient('http://1.94.139.139:8090');
                    apiClient.get('/father')
                        .then(data => console.log('GET response:', data))
                        .catch(error => console.error('GET request error:', error));
                })

            });

            // const addButton = document.createElement('button');
            // addButton.textContent = '增';
            // addButton.addEventListener('click', () => {
            //     alert(`增功能: ${item.label}`);
            // });
            //
            // const checkButton = document.createElement('button');
            // checkButton.textContent = '查';
            // checkButton.addEventListener('click', () => {
            //     alert(`查功能: ${item.label}`);
            // });
            //
            // actions.appendChild(addButton);
            // actions.appendChild(checkButton);
        });
    }

// 打开弹出页面
    openDatasPage() {
        this.modal!.style.display = 'block';
        this.initializeTags();
    }

// 关闭弹出页面
    closeDatasPage() {
        this.modal!.style.display = 'none';
    }
}