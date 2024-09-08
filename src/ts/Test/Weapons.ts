import {
    WEAR_TYPE,
    QUALITY,
} from "./enums";
export class Weapons  {
    id: number;  // 武器的唯一标识符
    name: string;  // 武器名称
    quality: QUALITY;  // 品质
    attack_power: number;  // 武器攻击力
    special_effects: any;  // 武器特殊效果
    description: any;  // 武器描述
    image_url: string;  // 武器图片地址
    wear_type: WEAR_TYPE;  // 武器类型
    can_be_destroyed: any;  // 是否可以摧毁
    attribute_bonus: any;  // 属性加成
    durability: number;  // 耐久度
    level_requirement: number;  // 最低使用等级
    created_at: any;  // 创建时间
    constructor(id: number, name: string, quality: QUALITY, attack_power: number, special_effects: any, description: any, image_url: string, wear_type: WEAR_TYPE, can_be_destroyed: any, attribute_bonus: any, durability: number, level_requirement: number, created_at: any) {
        this.id = id;
        this.name = name;
        this.quality = quality;
        this.attack_power = attack_power;
        this.special_effects = special_effects;
        this.description = description;
        this.image_url = image_url;
        this.wear_type = wear_type;
        this.can_be_destroyed = can_be_destroyed;
        this.attribute_bonus = attribute_bonus;
        this.durability = durability;
        this.level_requirement = level_requirement;
        this.created_at = created_at;
    }
    static getMetadata(): object {
        return {
            'class_name':'Weapons',
            'fields': [
                { 'name': 'id', 'type': 'number', 'default': undefined, 'comment': '武器的唯一标识符', 'auto_increase': 'AUTO_INCREMENT' },
                { 'name': 'name', 'type': 'string', 'default': "undefined", 'comment': '武器名称', },
                { 'name': 'quality', 'type': 'QUALITY', 'default': QUALITY.甲, 'comment': '品质', },
                { 'name': 'attack_power', 'type': 'number', 'default': 1, 'comment': '武器攻击力', },
                { 'name': 'special_effects', 'type': 'any', 'default': undefined, 'comment': '武器特殊效果', },
                { 'name': 'description', 'type': 'any', 'default': undefined, 'comment': '武器描述', },
                { 'name': 'image_url', 'type': 'string', 'default': "undefined", 'comment': '武器图片地址', },
                { 'name': 'wear_type', 'type': 'WEAR_TYPE', 'default': WEAR_TYPE.单手, 'comment': '武器类型', },
                { 'name': 'can_be_destroyed', 'type': 'any', 'default': undefined, 'comment': '是否可以摧毁', },
                { 'name': 'attribute_bonus', 'type': 'any', 'default': undefined, 'comment': '属性加成', },
                { 'name': 'durability', 'type': 'number', 'default': 100, 'comment': '耐久度', },
                { 'name': 'level_requirement', 'type': 'number', 'default': 1, 'comment': '最低使用等级', },
                { 'name': 'created_at', 'type': 'any', 'default': "now", 'comment': '创建时间', },
            ]};
    }
}