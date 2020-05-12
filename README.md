
### 表单设计器 使用react + antd开发
```
安装依赖 npm install
运行 npm run start
```
### 从左侧拖拽表单元素，放置在页面中间的表单编辑区域
![image](https://github.com/baiscode/form-design/blob/master/public/firstStep.gif)

### 修改表单组件的配置属性
![image](https://github.com/baiscode/form-design/blob/master/public/secondStep.gif)

## 修改SELECT、CHECKBOX、RADIO组件的options选项
![image](https://github.com/baiscode/form-design/blob/master/public/thirdStep.gif)

### 调整位置
![image](https://github.com/baiscode/form-design/blob/master/public/fourthStep.gif)

### 预览提交
![image](https://github.com/baiscode/form-design/blob/master/public/fifthStep.gif)

### 表单数据
```
[
    {
        "cellId":"23BFAF2D97",
        "children":[
            {
                "type":"NUMBER",
                "formItemId":"376D87309C",
                "labelName":"InputNumber数字框",
                "isRequired":true,
                "fontSize":14,
                "textAlign":"center",
                "fontStyle":[

                ],
                "message":"InputNumber数字框不能为空",
                "attrs":{
                    "max":1000,
                    "min":0,
                    "precision":0
                },
                "name":"NUMBER_CE7A933069",
                "pCellId":"23BFAF2D97"
            },
            {
                "type":"TEXT",
                "formItemId":"95A23D6D60",
                "labelName":"Input输入框啊啊啊啊啊",
                "isRequired":true,
                "fontSize":14,
                "textAlign":"center",
                "fontStyle":[

                ],
                "message":"Input输入框不能为空",
                "attrs":{
                    "placeholder":"请输入mingcheng",
                    "maxLength":50
                },
                "name":"TEXT_0CBDB8D880",
                "pCellId":"23BFAF2D97"
            }
        ]
    },
    {
        "cellId":"C80A3D4E8C",
        "children":[
            {
                "type":"TEXT",
                "formItemId":"AAD0FB3278",
                "labelName":"Input输入框",
                "isRequired":true,
                "fontSize":14,
                "textAlign":"center",
                "fontStyle":[

                ],
                "message":"Input输入框不能为空",
                "attrs":{
                    "placeholder":"请输入",
                    "maxLength":50
                },
                "name":"TEXT_6ABEE62F2A",
                "pCellId":"C80A3D4E8C"
            },
            {
                "type":"SELECT",
                "formItemId":"E000D427E4",
                "labelName":"Select下拉框",
                "isRequired":true,
                "fontSize":14,
                "textAlign":"center",
                "fontStyle":[

                ],
                "message":"Select下拉框不能为空",
                "attrs":{
                    "placeholder":"",
                    "options":[
                        {
                            "label":"a",
                            "value":"1",
                            "key":"58E49C05FE"
                        },
                        {
                            "label":"b",
                            "value":"2",
                            "key":"CEBC0D34CA"
                        }
                    ]
                },
                "name":"SELECT_F929EBEA78",
                "pCellId":"C80A3D4E8C"
            }
        ]
    }
]
```


