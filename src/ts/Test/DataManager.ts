import '../../css/test.css'
import {CreateElementWithClasses} from "../Utils/HtmlUtils";
import {HttpClient} from "./HttpClient";
import {ServerAddress} from "../../../config/config";
import {data} from "jquery";
import {QUALITY, WEAR_TYPE} from "./enums";
import {Weapons} from "./Weapons";
export class DataManager{
    table_list = ['father', 'child']
    modal:HTMLElement | undefined;
    addButton = document.getElementById('addButton') as HTMLButtonElement;
    itemContainer = document.getElementById('itemContainer') as HTMLDivElement;
    tagContainer = document.getElementById('tagContainer') as HTMLDivElement;
    openModalButton = document.getElementById('openModalButton') as HTMLButtonElement;
    closeModal = document.getElementById('closeModal') as HTMLSpanElement;
    contentContainer = document.getElementById('contentContainer') as HTMLDivElement;
    apiClient = new HttpClient(ServerAddress);

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
    getEnumOptions(type: string): { value: string; label: string }[] {
        // 示例枚举选项，实际应根据 type 返回正确的枚举选项
        if (type === 'QUALITY') {
            return [
                { value: '甲', label: '甲' },
                { value: '乙', label: '乙' },
                { value: '丙', label: '丙' }
            ];
        } else if (type === 'WEAR_TYPE') {
            return [
                { value: '单手', label: '单手' },
                { value: '双手', label: '双手' }
            ];
        }
        return [];
    }
    createFieldElement(field: any, value: any) {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'field';

        const label = document.createElement('label');
        label.textContent = field.comment || field.name;
        label.className = 'field-label';
        fieldDiv.appendChild(label);

        let input: HTMLInputElement | HTMLSelectElement;

        if (field.type === 'QUALITY' || field.type === 'WEAR_TYPE') {
            // 假设枚举选项通过某种方式可以获取
            const options = this.getEnumOptions(field.type); // 需要实现这个函数
            input = document.createElement('select');
            input.className = 'field-input';

            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.label;
                if (option.value === value) {
                    optionElement.selected = true;
                }
                (input as HTMLSelectElement).appendChild(optionElement);
            });
        } else if (field.type === 'number') {
            input = document.createElement('input');
            input.type = 'number';
            input.value = value ?? '';
            input.className = 'field-input';
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.value = value ?? '';
            input.className = 'field-input';
        }

        input.setAttribute('data-field', field.name);
        fieldDiv.appendChild(input);

        return fieldDiv;
    }


    createTableRow(metadata: any, rowData: any[]) {
        const container = document.createElement('div');
        container.className = 'table-row';

        // 创建块内容区域
        const contentArea = document.createElement('div');
        contentArea.className = 'content-area';
        container.appendChild(contentArea);

        // 显示name字段
        const nameDiv = document.createElement('div');
        nameDiv.className = 'name';
        // @ts-ignore
        nameDiv.textContent = rowData['name'] as string;
        contentArea.appendChild(nameDiv);

        // 显示图片
        // @ts-ignore
        const imageUrl = rowData['image_url'] as string;
        if (imageUrl) {
            const image = document.createElement('img');
            image.src = imageUrl;
            image.alt = 'Image';
            image.className = 'image';
            contentArea.appendChild(image);
        }

        // 详情按钮
        const detailsButton = document.createElement('button');
        detailsButton.textContent = '详情';
        detailsButton.addEventListener('click', () => {
            detailsDiv.style.display = detailsDiv.style.display === 'none' ? 'block' : 'none';
        });
        contentArea.appendChild(detailsButton);

        // 创建详细信息和操作按钮部分
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'details';
        detailsDiv.style.display = 'none'; // 默认隐藏

        metadata.fields.forEach((field: { name: string; }) => {
            if (field.name !== 'name' && field.name !== 'image_url') {
                // @ts-ignore
                const fieldDiv = this.createFieldElement(field, rowData[field.name]);
                detailsDiv.appendChild(fieldDiv);
            }
        });

        // 保存按钮
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.addEventListener('click', () => {
            const updatedData = {};
            detailsDiv.querySelectorAll('input, select').forEach(input => {
                const field = input.getAttribute('data-field');
                if (field) {
                    // @ts-ignore
                    updatedData[field] = (input as HTMLInputElement | HTMLSelectElement).value;
                }
            });
            console.log('保存数据:', updatedData);
        });
        detailsDiv.appendChild(saveButton);

        // 删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.addEventListener('click', () => {
            console.log('删除功能待实现');
            container.remove();
        });
        detailsDiv.appendChild(deleteButton);

        container.appendChild(detailsDiv);

        return container;
    }

    aaa(data:any[], contentContainer:HTMLElement) {
        console.log(data)
        data.forEach(item => {
            // 创建 Weapon 实例
            const weapon = new Weapons(
                item.id,
                item.name,
                item.quality as QUALITY,
                item.attack_power,
                item.special_effects,
                item.description,
                item.image_url,
                item.wear_type as WEAR_TYPE,
                item.can_be_destroyed,
                item.attribute_bonus,
                item.durability,
                item.level_requirement,
                item.created_at
            );
            console.log(weapon.created_at)
        });
        // 生成并插入页面元素
        const mainContainer = document.getElementById('main-container');
        const metadata = Weapons.getMetadata();

        if (contentContainer) {
            data.forEach(str => {
                const rowDiv = this.createTableRow(metadata, str);
                contentContainer.appendChild(rowDiv);
            });
        }

    }
    // 初始化标签
    initializeTags() {
        this.tagContainer.innerHTML = '';
        this.table_list.forEach(item => {
            let tag = CreateElementWithClasses('div',item,this.tagContainer,['tag'])
            CreateElementWithClasses('div','',tag,['tag-actions'])
            tag.addEventListener('click',()=>{
                this.contentContainer.innerHTML = '';
                this.apiClient.get('/weapons')
                    .then(data => this.aaa(data,this.contentContainer))
                    .catch(error => console.error('GET request error:', error));
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