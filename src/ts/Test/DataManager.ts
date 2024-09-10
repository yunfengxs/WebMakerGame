import '../../css/test.css'
import {CreateElement, CreateElementWithClasses} from "../Utils/HtmlUtils";
import {HttpClient} from "./HttpClient";
import {ServerAddress} from "../../../config/config";
import {data, error} from "jquery";
import {enumNameMap, QUALITY, WEAR_TYPE} from "./enums";
import {Weapons} from "./Weapons";
import {DataHtmlMaker} from "./DataHtmlMaker";

const metaDataMap = {
    'weapons':Weapons.getMetadata()
};
export class DataManager{
    table_list = ['weapons', 'child']
    modal:HTMLElement | undefined;
    addButton = document.getElementById('addButton') as HTMLButtonElement;
    itemContainer = document.getElementById('itemContainer') as HTMLDivElement;
    tagContainer = document.getElementById('tagContainer') as HTMLDivElement;
    openModalButton = document.getElementById('openModalButton') as HTMLButtonElement;
    closeModal = document.getElementById('closeModal') as HTMLSpanElement;
    contentContainer = document.getElementById('contentContainer') as HTMLDivElement;
    addContainer = document.getElementById('addContainer') as HTMLDivElement;
    apiClient = new HttpClient(ServerAddress);

    constructor() {
        this.modal = document.getElementById('modal') as HTMLElement;
        //this.table_list = table_list;

        // window.addEventListener('click', (event) => {
        //     if (event.target === this.modal) {
        //         // @ts-ignore
        //         this.modal.style.display = 'none';
        //     }
        // });
        this.closeModal.addEventListener('click', (event) => {
            this.closeDatasPage()
        })
    }
    // 初始化标签
    initializeTags() {
        this.tagContainer.innerHTML = '';
        this.table_list.forEach(item => {
            // @ts-ignore
            const dataHtmlMaker = new DataHtmlMaker(item, metaDataMap[item],this.apiClient)
            let tag = CreateElementWithClasses('div',item,this.tagContainer,['tag'])
            CreateElementWithClasses('div','',tag,['tag-actions'])
            tag.addEventListener('click',()=>{
                this.contentContainer.innerHTML = '';
                this.addContainer.innerHTML = '';
                const addDiv = CreateElementWithClasses('div','',this.addContainer,['table-row'])
                const addNewItem = CreateElement('button','新增',addDiv)
                addNewItem.addEventListener('click',()=>{
                    addNewItem.style.display = 'none';
                    dataHtmlMaker.addNewElement(addDiv, this.addContainer)
                })
                dataHtmlMaker.updateCurrentElement(this.contentContainer)
            })
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