const n=`\r
/**\r
* @File el-table合并方法\r
* @Type function\r
* @Author chen_yu\r
* @Date 2023-08-05 16:43:17\r
* @Version 1.0\r
* \r
* @Params \r
* \r
* @Description\r
* 使用页面基础配置\r
* 1.el-table中写入 \r
     :span-method="\r
        (data) => {\r
        return objectSpanMethod(data, pooledData);\r
    }"\r
* 2.页面引入方法  \r
    import { getSpanData,objectSpanMethod} from "此文件地址";\r
 * 3.使用\r
    初始化合并数据\r
    const pooledData = ref({});\r
    调用方法\r
    pooledData.value = getSpanData(["需要合并的列"]，需要合并的表格数组);（详细查看下方方法）\r
* \r
* \r
* \r
* @returns 表格合并相同值\r
*/\r
\r
// 计算需要合并的单元格\r
export const getSpanData = (columnList, data) => {\r
    let columnArr = [];//合并表格的列\r
    let spanArr = []; //临时组\r
    let spanData = []; // 组合的合并组\r
    //调用此方法第一个参数是配置需要合并的列(数组需要传入数组)\r
    /**\r
       * 第一列 columnArr = ['columnProps1']\r
       * 第二列 columnArr = ['','columnProps2']\r
       * ...\r
      */\r
    console.log(columnList, data);\r
    columnArr = columnList\r
    spanData = [];\r
    columnArr.forEach((element) => {\r
\r
        let contactDot = 0;\r
        spanArr = [];\r
        data.forEach((item, index) => {\r
            if (index === 0) {\r
                spanArr.push(1);\r
            } else {\r
                if (item[element] === data[index - 1][element]) {\r
                    spanArr[contactDot] += 1;\r
                    spanArr.push(0);\r
                } else {\r
                    contactDot = index;\r
                    spanArr.push(1);\r
                }\r
            }\r
        });\r
        spanData.push(spanArr);\r
    });\r
    return { columnArr, spanData }\r
};\r
//表格方法\r
export const objectSpanMethod = ({ row, column, rowIndex, columnIndex }, { columnArr, spanData }) => {\r
    if (columnArr.includes(column.property)) {\r
        if (spanData[columnIndex][rowIndex]) {\r
            return {\r
                rowspan: spanData[columnIndex][rowIndex],\r
                colspan: 1,\r
            };\r
        } else {\r
            return {\r
                rowspan: 0,\r
                colspan: 0,\r
            };\r
        }\r
    }\r
};`;export{n as default};
