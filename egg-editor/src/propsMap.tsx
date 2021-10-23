import {VNode} from 'vue'
import {TextComponentProps} from './defaultProps'

export interface PropToForm {
  component: string;
  subComponent?: string;
  // value?: string;
  extraProps?: {[key: string]: any};
  text?: string;
  options?: {text: string | VNode; value: any}[];
  initalTransform?: (value: any) => any;
  afterTransform?: (value: any) => any;
  valueProp?: string;
  eventName?: string;
}

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm
}

const fontFamilyArr = [
  {text: '宋体', value: '"SimSun","STSong"'},
  {text: '黑体', value: '"SimHei","STHeiti"'},
  {text: '楷体', value: '"KaiTi","STKaiti"'},
  {text: '仿宋', value: '"FangSong","STFangsong"'},
]

const borderColorArr = [
  {text: 'normal', value: 'blue'},
  {text: 'error', value: 'red'},
  {text: 'success', value: 'green'},
  {text: 'warring', value: 'orange'},
]

const borderTypeArr = [
  {text: '实线', value: 'solid'},
  {text: '破折线', value: 'dashed'},
  {text: '双线式', value: 'double'},
  {text: '点状线', value: 'dotted'},
]

const fontFamilyOptions = fontFamilyArr.map((font) => {
  return {
    value: font.value,
    text: (<span style={{fontFamily: font.value}}>{font.text}</span>) as VNode,
  }
})

export const mapPropsToForms: PropsToForms = {
  text: {
    text: '文本：',
    component: 'a-textarea',
    extraProps: {rows: 3},
    afterTransform: (e: any) => e.target.value,
  },
  fontSize: {
    text: '字号：',
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => (e || e == 0 ? `${e}px` : ''),
  },
  lineHeight: {
    text: '行高：',
    component: 'a-slider',
    extraProps: {min: 0, max: 3, step: 0.1},
    initalTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString(),
  },
  textAlign: {
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    text: '对齐：',
    options: [
      {text: '左', value: 'left'},
      {text: '中', value: 'center'},
      {text: '右', value: 'right'},
    ],
    afterTransform: (e: any) => e.target.value,
  },
  // font
  fontFamily: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '字体：',
    options: [{value: '', text: '无'}, ...fontFamilyOptions],
  },
  fontWeight: {
    component: 'icon-switch',
    initalTransform: (v: string) => v === 'bold',
    afterTransform: (e: boolean) => (e ? 'bold' : 'normal'),
    valueProp: 'checked',
    extraProps: {iconName: 'BoldOutlined', tip: '加粗'},
  },
  fontStyle: {
    component: 'icon-switch',
    initalTransform: (v: string) => v === 'italic',
    afterTransform: (e: boolean) => (e ? 'italic' : 'normal'),
    valueProp: 'checked',
    extraProps: {iconName: 'ItalicOutlined', tip: '斜体'},
  },
  textDecoration: {
    component: 'icon-switch',
    initalTransform: (v: string) => v === 'underline',
    afterTransform: (e: boolean) => (e ? 'underline' : 'none'),
    valueProp: 'checked',
    extraProps: {iconName: 'UnderlineOutlined', tip: '下划线'},
  },

  // 内边距
  paddingLeft: {
    text: '左内边距：',
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => (e || e == 0 ? `${e}px` : ''),
  },
  paddingRight: {
    text: '右内边距：',
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => (e || e == 0 ? `${e}px` : ''),
  },
  paddingTop: {
    text: '上内边距：',
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => (e || e == 0 ? `${e}px` : ''),
  },
  paddingBottom: {
    text: '下内边距：',
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => (e || e == 0 ? `${e}px` : ''),
  },
  // 宽高
  width: {
    text: '宽度：',
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => (e || e == 0 ? `${e}px` : ''),
  },
  height: {
    text: '高度',
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => (e || e == 0 ? `${e}px` : ''),
  },
  // 边框
  borderWidth: {
    text: '边框宽度',
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => (e || e == 0 ? `${e}px` : ''),
  },
  borderRadius: {
    text: '边框圆角',
    component: 'a-input-number',
    initalTransform: (v: string) => parseInt(v),
    afterTransform: (e: any) => (e || e == 0 ? `${e}px` : ''),
  },
  borderColor: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '边框颜色：',
    options: [{value: 'rgba(255,255,255,0)', text: 'none'}, ...borderColorArr],
  },
  borderStyle: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '边框类型：',
    options: [{value: 'none', text: '无边框'}, ...borderTypeArr],
  },
  // 阴影与透明度
  opacity: {
    text: '透明度：',
    component: 'a-slider',
    extraProps: {min: 0, max: 100, step: 1, reverse: true},
    initalTransform: (v: string) => parseFloat(v) * 100,
    afterTransform: (e: number) => (e / 100).toString(),
  },
  color: {
    text: '字体颜色：',
    component: 'color-picker',
  },
}
