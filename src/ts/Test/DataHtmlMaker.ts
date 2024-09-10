import {HttpClient} from "./HttpClient";
import {Weapons} from "./Weapons";
import {enumNameMap, QUALITY, WEAR_TYPE} from "./enums";
import {CreateElement, CreateElementWithClasses} from "../Utils/HtmlUtils";

export class DataHtmlMaker{
    endpoint = "/"
    metadata : any = null
    apiClient: HttpClient | undefined

    constructor(endpoint: string, metadata: any, apiClient: HttpClient | undefined) {
        this.endpoint = this.endpoint + endpoint;
        this.metadata = metadata;
        this.apiClient = apiClient;
    }

    updateCurrentElement (father:HTMLElement) {
        // @ts-ignore
        this.apiClient.get(this.endpoint)
            .then(data => this.createNewElement(data, father))
            .catch(error => console.error('GET request error:', error));
    }

    addNewElement (addButton:HTMLElement, father:HTMLElement) {
        // @ts-ignore
        if (father) {
            const addDev = CreateElementWithClasses('div','',father,['table-row']);
            const addButtons = CreateElement('div','',addDev);
            CreateElementWithClasses('button','保存', addButtons ,[]).addEventListener('click',()=>{
                addButton.style.display = 'block'
                addDev.style.display = 'none'
                const insertedData = {};
                addDev.querySelectorAll('input, select').forEach(input => {
                    const field = input.getAttribute('data-field');
                    if (field) {
                        // @ts-ignore
                        insertedData[field] = (input as HTMLInputElement | HTMLSelectElement).value;
                    }
                });
                // @ts-ignore
                this.apiClient.post(this.endpoint, insertedData)
                    .then(data => {console.log('Resource updated successfully:', data);})
                    .catch(error => {console.error('PUT request error:', error);});
            });

            CreateElementWithClasses('button','取消', addButtons ,[]).addEventListener('click',()=>{
                addButton.style.display = 'block'
                addDev.style.display = 'none';
            })
            this.metadata['fields'].forEach((item: { [x: string]: any; })=>{
                const oneFiled:null | HTMLDivElement = this.createFieldElement(item, item['default'])
                if (oneFiled != null) {
                    addDev.appendChild(oneFiled)
                }

            })

        }
    }

    createNewElement(data:any, father:HTMLElement) {
        if (father) {
            data.forEach((str: any) => {
                const rowDiv = this.createTableRow(this.metadata, str);
                father.appendChild(rowDiv);
            });
        }
    }
    createFieldElement(field: any, value: any) {
        if ( field.name === 'created_at') {
            return null;
        }
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'field';

        const label = document.createElement('label');
        label.textContent = field.comment || field.name;
        label.className = 'field-label';
        fieldDiv.appendChild(label);

        let input: HTMLInputElement | HTMLSelectElement;

        // @ts-ignore
        if (enumNameMap[field.type] != null) {
            // 假设枚举选项通过某种方式可以获取
            // @ts-ignore
            const options = enumNameMap[field.type]; // 需要实现这个函数
            input = document.createElement('select');
            input.className = 'field-input';

            for(const key in options) {
                const optionElement = document.createElement('option');
                optionElement.value = options[key];
                optionElement.textContent = options[key];
                if (options[key] === value) {
                    optionElement.selected = true;
                }
                (input as HTMLSelectElement).appendChild(optionElement);
            }
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
        if (field.name === 'id' ){
            fieldDiv.style.display = "none"
        }
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
            // @ts-ignore
            const fieldDiv = this.createFieldElement(field, rowData[field.name]);
            if (fieldDiv != null) {
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
            // @ts-ignore
            this.apiClient.put(this.endpoint + "/" + updatedData['id'], updatedData)
                .then(data => {console.log('Resource added successfully:', data);})
                .catch(error => {console.error('POST request error:', error);});
        });
        detailsDiv.appendChild(saveButton);

        // 删除按钮
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '删除';
        deleteButton.addEventListener('click', () => {
            const updatedData = {};
            detailsDiv.querySelectorAll('input, select').forEach(input => {
                const field = input.getAttribute('data-field');
                if (field) {
                    // @ts-ignore
                    updatedData[field] = (input as HTMLInputElement | HTMLSelectElement).value;
                }
            });
            // @ts-ignore
            this.apiClient.delete(this.endpoint + "/" + updatedData['id'])
                .then(()=>console.log('delete successfully:'))
                .catch(error => {console.error('DELETE request error:', error);});
            container.remove();
        });
        detailsDiv.appendChild(deleteButton);
        container.appendChild(detailsDiv);
        return container;
    }

    aaa(data:any[], contentContainer:HTMLElement) {
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
        });
        // 生成并插入页面元素
    }


}