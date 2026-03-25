const r=`<template>\r
  <div class="page">\r
    <div class="toolbar">\r
      <el-autocomplete\r
        v-model="searchKeyword"\r
        :fetch-suggestions="querySearch"\r
        placeholder="请输入公司名称搜索"\r
        class="search-input"\r
        @select="handleSelect"\r
        clearable\r
      >\r
        <template #prefix>\r
          <el-icon><Search /></el-icon>\r
        </template>\r
      </el-autocomplete>\r
      <el-button type="primary" @click="exportGraph">\r
        <el-icon><Download /></el-icon>\r
        导出架构图\r
      </el-button>\r
      <el-button type="success" @click="showData">\r
        <el-icon><View /></el-icon>\r
        查看数据\r
      </el-button>\r
    </div>\r
    <div ref="container" class="org-tree-container"></div>\r
    <!-- 编辑弹窗 -->\r
    <el-dialog\r
      v-model="showModal"\r
      :title="\r
        modalType === 'edit'\r
          ? '编辑公司'\r
          : currentNode?.id === 'root'\r
          ? '新增集团公司'\r
          : '新增子公司'\r
      "\r
      width="550px"\r
      :close-on-click-modal="false"\r
    >\r
      <el-form :model="form" label-width="200px" :rules="rules" ref="formRef">\r
        <el-form-item label="企业名称" prop="label">\r
          <el-input v-model="form.name" placeholder="请输入企业名称" />\r
        </el-form-item>\r
        <el-form-item label="统一社会信用代码" prop="creditCode">\r
          <el-input\r
            v-model="form.creditCode"\r
            placeholder="请输入统一社会信用代码"\r
          />\r
        </el-form-item>\r
        <el-form-item\r
          v-if="\r
            (modalType === 'add' && currentNode?.id !== 'root') ||\r
            (modalType === 'edit' && form.parentId)\r
          "\r
          label="母公司统一社会信用代码"\r
          prop="parentCreditCode"\r
        >\r
          <el-input\r
            v-model="form.parentCreditCode"\r
            placeholder="请输入母公司统一社会信用代码"\r
            :disabled="true"\r
          />\r
        </el-form-item>\r
        <el-form-item\r
          v-if="\r
            (modalType === 'add' && currentNode?.id !== 'root') ||\r
            (modalType === 'edit' && form.parentId)\r
          "\r
          label="所属母公司"\r
          prop="parentId"\r
        >\r
          <el-select\r
            style="width: 100%"\r
            v-model="form.parentId"\r
            placeholder="请选择所属母公司"\r
            :disabled="true"\r
          >\r
            <el-option\r
              v-for="item in companyOptions"\r
              :key="item.id"\r
              :label="item.label"\r
              :value="item.id"\r
            />\r
          </el-select>\r
        </el-form-item>\r
        <el-form-item label="是否纳入母公司报表" prop="isIncluded">\r
          <el-radio-group v-model="form.isIncluded">\r
            <el-radio :label="true">是</el-radio>\r
            <el-radio :label="false">否</el-radio>\r
          </el-radio-group>\r
        </el-form-item>\r
        <el-form-item label="母公司股份占比" prop="percent">\r
          <el-input-number\r
            style="width: 60%"\r
            v-model="form.percent"\r
            :min="0"\r
            :max="100"\r
            :precision="2"\r
            :step="0.1"\r
          />\r
          <span class="unit">%</span>\r
        </el-form-item>\r
      </el-form>\r
      <template #footer>\r
        <span class="dialog-footer">\r
          <el-button @click="showModal = false">取消</el-button>\r
          <el-button type="primary" @click="handleSave">确定</el-button>\r
        </span>\r
      </template>\r
    </el-dialog>\r
\r
    <!-- 数据查看弹窗 -->\r
    <json-viewer\r
      v-model="showDataModal"\r
      :data="actualData"\r
      title="树形结构数据"\r
    />\r
  </div>\r
</template>\r
\r
<script setup>\r
import { ref, onMounted, watch, computed } from "vue";\r
import G6 from "@antv/g6";\r
import { ElMessage, ElMessageBox } from "element-plus";\r
import {\r
  Download,\r
  View,\r
  Expand,\r
  Fold,\r
  CopyDocument,\r
  ArrowDown,\r
  ArrowRight,\r
  Search,\r
} from "@element-plus/icons-vue";\r
import "element-plus/dist/index.css";\r
import JsonViewer from "./components/JsonViewer.vue";\r
\r
// 构造初始数据\r
const data = ref({\r
  id: "root",\r
  children: [\r
    {\r
      id: "1",\r
      name: "先正达集团股份有限公司",\r
      creditCode: "91110000100000000",\r
      parentCreditCode: "",\r
      parentId: "",\r
      isIncluded: true,\r
      percent: 100,\r
      children: [\r
        {\r
          id: "2",\r
          name: "中国种子集团有限公司",\r
          creditCode: "91110000200000000",\r
          parentCreditCode: "91110000100000000",\r
          parentId: "1",\r
          isIncluded: true,\r
          percent: 100,\r
          children: [\r
            {\r
              id: "3",\r
              name: "中种农业科技（湖南）有限公司",\r
              creditCode: "91110000300000000",\r
              parentCreditCode: "91110000200000000",\r
              parentId: "2",\r
              isIncluded: true,\r
              percent: 100,\r
              children: [],\r
            },\r
            {\r
              id: "4",\r
              name: "中种国际种子有限公司",\r
              creditCode: "91110000400000000",\r
              parentCreditCode: "91110000200000000",\r
              parentId: "2",\r
              isIncluded: true,\r
              percent: 100,\r
              children: [],\r
            },\r
            {\r
              id: "5",\r
              name: "安徽江淮园艺种业股份有限公司",\r
              creditCode: "91110000500000000",\r
              parentCreditCode: "91110000200000000",\r
              parentId: "2",\r
              isIncluded: false,\r
              percent: 98,\r
              children: [],\r
            },\r
            {\r
              id: "6",\r
              name: "山西大丰种业有限公司",\r
              creditCode: "91110000600000000",\r
              parentCreditCode: "91110000200000000",\r
              parentId: "2",\r
              isIncluded: true,\r
              percent: 100,\r
              children: [],\r
            },\r
            {\r
              id: "7",\r
              name: "广东省金稻种业有限公司",\r
              creditCode: "91110000700000000",\r
              parentCreditCode: "91110000200000000",\r
              parentId: "2",\r
              isIncluded: true,\r
              percent: 100,\r
              children: [],\r
            },\r
          ],\r
        },\r
        {\r
          id: "8",\r
          name: "三北种业有限公司",\r
          creditCode: "91110000800000000",\r
          parentCreditCode: "91110000100000000",\r
          parentId: "1",\r
          isIncluded: true,\r
          percent: 100,\r
          children: [],\r
        },\r
      ],\r
    },\r
    {\r
      id: "9",\r
      name: "另一个集团公司",\r
      creditCode: "91110000900000000",\r
      parentCreditCode: "",\r
      parentId: "",\r
      isIncluded: true,\r
      percent: 100,\r
      children: [\r
        {\r
          id: "10",\r
          name: "子公司A",\r
          creditCode: "91110000100000000",\r
          parentCreditCode: "91110000900000000",\r
          parentId: "9",\r
          isIncluded: true,\r
          percent: 100,\r
          children: [],\r
        },\r
        {\r
          id: "11",\r
          name: "子公司B",\r
          creditCode: "91110000110000000",\r
          parentCreditCode: "91110000900000000",\r
          parentId: "9",\r
          isIncluded: true,\r
          percent: 100,\r
          children: [],\r
        },\r
      ],\r
    },\r
  ],\r
});\r
\r
const clearTooltip = () => {\r
  console.log("clearTooltip");\r
  // 清空所有tooltip\r
\r
  // 获取所有带有 .node-tooltip 类的DOM元素并移除\r
  const tooltips = document.querySelectorAll(".node-tooltip");\r
  tooltips.forEach((tooltip) => {\r
    tooltip.parentNode && tooltip.parentNode.removeChild(tooltip);\r
  });\r
};\r
// 弹窗相关\r
const showModal = ref(false);\r
const modalType = ref("edit");\r
const formRef = ref();\r
const form = ref({\r
  id: "",\r
  name: "",\r
  label: "",\r
  creditCode: "",\r
  parentCreditCode: "",\r
  parentId: "",\r
  isIncluded: true,\r
  percent: 100,\r
});\r
let currentNode = null;\r
\r
// G6实例\r
const container = ref(null);\r
let graph = null;\r
\r
// 表单验证规则\r
const rules = {\r
  name: [\r
    { required: true, message: "请输入企业名称", trigger: "blur" },\r
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },\r
  ],\r
  creditCode: [\r
    { required: true, message: "请输入统一社会信用代码", trigger: "blur" },\r
    {\r
      required: true,\r
      message: "请输入正确的统一社会信用代码",\r
      trigger: "blur",\r
    },\r
  ],\r
  parentCreditCode: [\r
    {\r
      required: true,\r
      message: "请输入母公司统一社会信用代码",\r
      trigger: "blur",\r
    },\r
    {\r
      required: true,\r
      message: "请输入正确的统一社会信用代码",\r
      trigger: "blur",\r
    },\r
  ],\r
  parentId: [{ required: true, message: "请选择所属母公司", trigger: "blur" }],\r
  isIncluded: [\r
    { required: true, message: "请选择是否纳入母公司报表", trigger: "change" },\r
  ],\r
  percent: [\r
    { required: true, message: "请输入母公司股份占比", trigger: "blur" },\r
    {\r
      type: "number",\r
      min: 0,\r
      max: 100,\r
      message: "占比必须在0-100之间",\r
      trigger: "blur",\r
    },\r
  ],\r
};\r
\r
// 获取所有公司选项\r
const companyOptions = ref([]);\r
\r
// 更新公司选项\r
function updateCompanyOptions() {\r
  const options = [];\r
  function traverse(node) {\r
    if (node.id !== "root") {\r
      options.push({\r
        id: node.id,\r
        label: node.name,\r
      });\r
    }\r
    if (node.children) {\r
      node.children.forEach(traverse);\r
    }\r
  }\r
  traverse(data.value);\r
  companyOptions.value = options;\r
}\r
\r
// 工具函数：递归查找节点\r
function findNodeById(node, id) {\r
  if (node.id === id) return node;\r
  if (!node.children) return null;\r
  for (const child of node.children) {\r
    const found = findNodeById(child, id);\r
    if (found) return found;\r
  }\r
  return null;\r
}\r
\r
// 工具函数：递归删除节点\r
function deleteNodeById(node, id) {\r
  if (node.id === "root") {\r
    const idx = node.children.findIndex((child) => child.id === id);\r
    if (idx !== -1) {\r
      node.children.splice(idx, 1);\r
      return true;\r
    }\r
    for (const child of node.children) {\r
      if (deleteNodeById(child, id)) return true;\r
    }\r
  } else if (node.children) {\r
    const idx = node.children.findIndex((child) => child.id === id);\r
    if (idx !== -1) {\r
      node.children.splice(idx, 1);\r
      return true;\r
    }\r
    for (const child of node.children) {\r
      if (deleteNodeById(child, id)) return true;\r
    }\r
  }\r
  return false;\r
}\r
\r
// 打开弹窗时设置表单数据\r
function openModal(type, node) {\r
  modalType.value = type;\r
  currentNode = node;\r
\r
  if (type === "edit") {\r
    form.value = { ...node };\r
  } else {\r
    // 新增时的默认值\r
    const defaultForm = {\r
      id: "",\r
      name: "",\r
      label: "",\r
      creditCode: "",\r
      parentCreditCode: "",\r
      parentId: "",\r
      isIncluded: true,\r
      percent: 100,\r
    };\r
\r
    // 如果是新增子公司（非根节点），则填充母公司信息\r
    if (node && node.id !== "root") {\r
      defaultForm.parentCreditCode = node.creditCode;\r
      defaultForm.parentId = node.id;\r
    }\r
\r
    form.value = defaultForm;\r
  }\r
  showModal.value = true;\r
}\r
\r
// 保存编辑/新增\r
async function handleSave() {\r
  if (!formRef.value) return;\r
\r
  try {\r
    await formRef.value.validate();\r
\r
    if (modalType.value === "edit") {\r
      // 编辑\r
      const node = findNodeById(data.value, form.value.id);\r
      if (node) {\r
        Object.assign(node, form.value);\r
      }\r
    } else if (modalType.value === "add") {\r
      // 新增\r
      const parent = findNodeById(data.value, currentNode.id);\r
      if (parent) {\r
        const newId = Date.now().toString();\r
        parent.children = parent.children || [];\r
        parent.children.push({\r
          ...form.value,\r
          id: newId,\r
          children: [],\r
        });\r
      }\r
    }\r
    showModal.value = false;\r
    allCompanies.value = [];\r
    getAllCompanies(data.value);\r
    renderGraph();\r
  } catch (error) {\r
    console.error("表单验证失败:", error);\r
  }\r
}\r
\r
// 渲染树图\r
function renderGraph() {\r
  searchKeyword.value = "";\r
  if (!container.value) return;\r
  if (graph) graph.destroy();\r
\r
  graph = new G6.TreeGraph({\r
    container: container.value,\r
    width: container.value.clientWidth || 1000,\r
    height: container.value.clientHeight || 600,\r
    modes: {\r
      default: [\r
        "drag-canvas",\r
        "zoom-canvas",\r
        {\r
          type: "drag-node",\r
          enableDelegate: true,\r
          delegateStyle: {\r
            fill: "#f3f3f3",\r
            stroke: "#1890ff",\r
            lineDash: [5, 5],\r
            shadowColor: "#1890ff",\r
            shadowBlur: 10,\r
            opacity: 0.8,\r
          },\r
        },\r
      ],\r
    },\r
    defaultNode: {\r
      type: "rect",\r
      size: [220, 60],\r
      style: {\r
        fill: "#fff",\r
        stroke: "#1890ff",\r
        radius: 10,\r
        shadowColor: "#1890ff33",\r
        shadowBlur: 10,\r
      },\r
      labelCfg: {\r
        style: {\r
          fill: "#333",\r
          fontSize: 16,\r
          fontWeight: 600,\r
        },\r
      },\r
    },\r
    defaultEdge: {\r
      type: "cubic-horizontal",\r
      style: {\r
        stroke: "#1890ff",\r
        lineWidth: 2,\r
      },\r
    },\r
    layout: {\r
      type: "compactBox",\r
      direction: "LR",\r
      getId: (d) => d.id,\r
      getHeight: () => 60,\r
      getWidth: () => 220,\r
      getVGap: () => 30,\r
      getHGap: () => 60,\r
    },\r
  });\r
\r
  // 自定义节点内容\r
  graph.node((node) => {\r
    // 虚拟根节点\r
    if (node.id === "root") {\r
      return {\r
        label: "新增集团公司",\r
        labelCfg: {\r
          style: {\r
            fill: "#1890ff",\r
            fontSize: 16,\r
            fontWeight: 700,\r
          },\r
        },\r
        style: {\r
          fill: "#fff",\r
          stroke: "#1890ff",\r
          radius: 10,\r
          shadowColor: "#1890ff33",\r
          shadowBlur: 10,\r
          cursor: "pointer",\r
        },\r
        draggable: false,\r
      };\r
    }\r
\r
    const displayLabel =\r
      node.name.length > 10\r
        ? JSON.parse(JSON.stringify(node.name)).slice(0, 10) + "..."\r
        : node.name;\r
    return {\r
      label: displayLabel,\r
      name: node.name,\r
      labelCfg: {\r
        style: {\r
          fill: "#1890ff",\r
          fontSize: 16,\r
          fontWeight: 700,\r
          width: 220,\r
          height: 60,\r
        },\r
      },\r
      style: {\r
        cursor: "move",\r
        fill: "#fff",\r
        stroke: "#1890ff",\r
        radius: 10,\r
        shadowColor: "#1890ff33",\r
        shadowBlur: 10,\r
      },\r
      draggable: true,\r
    };\r
  });\r
\r
  // 自定义边\r
  graph.edge((edge) => {\r
    // 不显示根节点的边\r
    if (edge.source === "root") {\r
      return {\r
        style: {\r
          stroke: "transparent",\r
        },\r
      };\r
    }\r
    return {\r
      type: "cubic-horizontal",\r
      style: {\r
        stroke: "#1890ff",\r
        lineWidth: 2,\r
      },\r
    };\r
  });\r
\r
  // 渲染后自定义HTML内容\r
  graph.on("afterrender", () => {\r
    graph.getNodes().forEach((item) => {\r
      const model = item.getModel();\r
      const group = item.getContainer();\r
      // 清除旧的自定义内容\r
      group\r
        .findAll((el) => el.cfg && el.cfg.className === "custom-html")\r
        .forEach((el) => el.remove());\r
\r
      // 虚拟根节点只显示新增按钮\r
      if (model.id === "root") {\r
        const shape = group.addShape("text", {\r
          attrs: {\r
            x: -60,\r
            y: 0,\r
            text: "➕",\r
            fontSize: 20,\r
            cursor: "pointer",\r
            fill: "#1890ff",\r
            textAlign: "center",\r
            textBaseline: "middle",\r
          },\r
          className: "custom-html",\r
          name: "add",\r
          draggable: false,\r
        });\r
\r
        // 为新增按钮添加点击事件\r
        shape.on("click", (evt) => {\r
          evt.stopPropagation();\r
          openModal("add", { id: "root", creditCode: "" });\r
        });\r
        return;\r
      }\r
\r
      // 添加备注、占比\r
      group.addShape("text", {\r
        attrs: {\r
          x: -100,\r
          y: 50,\r
          text: \`\${model.isIncluded ? "" : "不"}纳入母公司报表；母公司占比: \${\r
            model.percent\r
          }%\`,\r
          fill: model.isIncluded ? "#52c41a" : "#faad14",\r
          fontSize: 13,\r
          fontWeight: 400,\r
        },\r
        className: "custom-html",\r
        draggable: false,\r
      });\r
\r
      // 添加操作按钮（编辑、删除、新增）\r
      const btns = [\r
        { text: "➕", action: "add" },\r
        { text: "✏️", action: "edit" },\r
        { text: "🗑️", action: "delete" },\r
      ];\r
\r
      // 计算按钮位置\r
      const btnSize = 16; // 按钮大小\r
      const btnSpacing = 8; // 按钮间距\r
      const totalWidth = btns.length * (btnSize + btnSpacing) - btnSpacing;\r
      const startX = 50; // 从右侧开始的位置\r
\r
      btns.forEach((btn, i) => {\r
        const x = startX + i * (btnSize + btnSpacing);\r
        const shape = group.addShape("text", {\r
          attrs: {\r
            x: x - 10,\r
            y: 20,\r
            text: btn.text,\r
            fontSize: 14,\r
            cursor: "pointer",\r
            opacity: 0,\r
            fill: "#1890ff",\r
            textAlign: "center",\r
            textBaseline: "middle",\r
          },\r
          className: "custom-html",\r
          name: btn.action,\r
          draggable: false,\r
        });\r
\r
        // 为每个按钮添加点击事件\r
        shape.on("click", (evt) => {\r
          evt.stopPropagation(); // 阻止事件冒泡\r
          const action = btn.action;\r
          if (action === "edit") {\r
            openModal("edit", model);\r
          } else if (action === "add") {\r
            openModal("add", model);\r
          } else if (action === "delete") {\r
            if (model.id === data.value.id) {\r
              ElMessage.warning("根节点不能删除！");\r
              return;\r
            }\r
            ElMessageBox.confirm("确定要删除该公司及其所有下级吗？", "提示", {\r
              confirmButtonText: "确定",\r
              cancelButtonText: "取消",\r
              type: "warning",\r
            })\r
              .then(() => {\r
                deleteNodeById(data.value, model.id);\r
                renderGraph();\r
                ElMessage.success("删除成功");\r
              })\r
              .catch(() => {});\r
          }\r
        });\r
      });\r
    });\r
  });\r
\r
  // 添加鼠标悬停事件\r
  graph.on("node:mouseenter", (evt) => {\r
    const group = evt.item.getContainer();\r
    const model = evt.item.getModel();\r
\r
    // 虚拟根节点不显示悬停效果\r
    if (model.id === "root") return;\r
\r
    // 如果显示的名称和实际名称不同，显示tooltip\r
    if (model.label !== model.name) {\r
      const bbox = evt.item.getBBox();\r
      const tooltip = document.createElement("div");\r
      tooltip.className = "node-tooltip";\r
      tooltip.style.cssText = \`\r
        position: absolute;\r
        background: rgba(0, 0, 0, 0.8);\r
        color: white;\r
        padding: 4px 8px;\r
        border-radius: 4px;\r
        font-size: 14px;\r
        z-index: 1000;\r
        pointer-events: none;\r
        white-space: nowrap;\r
        transform: translate(-50%, -100%);\r
        margin-top: -8px;\r
      \`;\r
      tooltip.textContent = model.name;\r
      document.body.appendChild(tooltip);\r
\r
      // 计算tooltip位置\r
      const point = graph.getPointByClient(evt.clientX, evt.clientY);\r
      const x = point.x;\r
      const y = bbox.minY - 10;\r
\r
      tooltip.style.left = \`\${evt.clientX}px\`;\r
      tooltip.style.top = \`\${evt.clientY - 30}px\`;\r
\r
      // 存储tooltip引用，以便在mouseleave时移除\r
      evt.item.set("tooltip", tooltip);\r
    }\r
\r
    const shapes = group.findAll(\r
      (el) => el.cfg && el.cfg.className === "custom-html" && el.cfg.name\r
    );\r
    shapes.forEach((shape) => {\r
      shape.animate(\r
        {\r
          opacity: 1,\r
        },\r
        {\r
          duration: 200,\r
          easing: "easeCubic",\r
        }\r
      );\r
    });\r
  });\r
\r
  // 添加鼠标离开事件\r
  graph.on("node:mouseleave", (evt) => {\r
    const group = evt.item.getContainer();\r
    const model = evt.item.getModel();\r
\r
    // 虚拟根节点不显示悬停效果\r
    if (model.id === "root") return;\r
\r
    // 移除tooltip\r
    const tooltip = evt.item.get("tooltip");\r
    if (tooltip) {\r
      document.body.removeChild(tooltip);\r
      evt.item.set("tooltip", null);\r
    }\r
\r
    const shapes = group.findAll(\r
      (el) => el.cfg && el.cfg.className === "custom-html" && el.cfg.name\r
    );\r
    shapes.forEach((shape) => {\r
      shape.animate(\r
        {\r
          opacity: 0,\r
        },\r
        {\r
          duration: 200,\r
          easing: "easeCubic",\r
        }\r
      );\r
    });\r
  });\r
\r
  // 添加节点点击事件\r
  graph.on("node:click", (evt) => {\r
    const model = evt.item.getModel();\r
    if (model.id === "root") {\r
      openModal("add", { id: "root", creditCode: "" });\r
    }\r
  });\r
\r
  // 添加拖拽相关事件\r
  let draggedNode = null;\r
  let targetNode = null;\r
  let highlightedNode = null;\r
\r
  // 开始拖拽\r
  graph.on("node:dragstart", (evt) => {\r
    const model = evt.item.getModel();\r
    if (model.id === "root") return;\r
    draggedNode = model;\r
\r
    // 设置拖拽节点的样式\r
    evt.item.getContainer().findAll((shape) => {\r
      if (shape.cfg && shape.cfg.className === "custom-html") return;\r
      shape.attr("opacity", 0.5);\r
    });\r
  });\r
\r
  // 拖拽过程中\r
  graph.on("node:drag", (evt) => {\r
    const point = { x: evt.x, y: evt.y };\r
    const nodes = graph.getNodes();\r
    let minDistance = Infinity;\r
    let nearestNode = null;\r
\r
    // 清除之前的高亮\r
    if (highlightedNode) {\r
      highlightedNode.getContainer().findAll((shape) => {\r
        if (shape.cfg && shape.cfg.className === "custom-html") return;\r
        shape.attr("stroke", "#1890ff");\r
        shape.attr("lineWidth", 1);\r
      });\r
      highlightedNode = null;\r
    }\r
\r
    // 计算最近的节点\r
    nodes.forEach((node) => {\r
      const model = node.getModel();\r
      if (model.id === draggedNode?.id) return;\r
\r
      const bbox = node.getBBox();\r
      const centerX = bbox.centerX;\r
      const centerY = bbox.centerY;\r
      const distance = Math.sqrt(\r
        Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)\r
      );\r
\r
      if (distance < minDistance) {\r
        minDistance = distance;\r
        nearestNode = node;\r
      }\r
    });\r
\r
    if (nearestNode && minDistance < 100) {\r
      const model = nearestNode.getModel();\r
      targetNode = model;\r
      highlightedNode = nearestNode;\r
      // 高亮目标节点\r
      nearestNode.getContainer().findAll((shape) => {\r
        if (shape.cfg && shape.cfg.className === "custom-html") return;\r
        shape.attr("stroke", "#52c41a");\r
        shape.attr("lineWidth", 2);\r
      });\r
    } else {\r
      targetNode = null;\r
    }\r
  });\r
\r
  // 拖拽结束\r
  graph.on("node:dragend", (evt) => {\r
    console.log(evt);\r
\r
    // 恢复所有节点样式\r
    graph.getNodes().forEach((node) => {\r
      node.getContainer().findAll((shape) => {\r
        console.log(shape.cfg.attrs.text);\r
        console.log(shape.attrs);\r
\r
        if (shape.cfg && shape.cfg.className === "custom-html") return;\r
        shape.attr("stroke", "#1890ff");\r
        shape.attr("lineWidth", 1);\r
        shape.attr("opacity", 1);\r
        shape.attr("fontWeight", "300");\r
      });\r
    });\r
    if (!draggedNode || !targetNode) {\r
      draggedNode = null;\r
      targetNode = null;\r
      highlightedNode = null;\r
      return;\r
    }\r
\r
    // 检查是否拖拽到自己的子节点上\r
    if (targetNode.id !== "root" && isDescendant(draggedNode, targetNode)) {\r
      ElMessage.warning("不能将节点拖拽到其子节点下！");\r
      draggedNode = null;\r
      targetNode = null;\r
      highlightedNode = null;\r
      return;\r
    }\r
\r
    try {\r
      // 更新数据结构\r
      moveNode(draggedNode, targetNode);\r
      ElMessage.success("节点移动成功");\r
    } catch (error) {\r
      ElMessage.error("节点移动失败，请重试");\r
    } finally {\r
      draggedNode = null;\r
      targetNode = null;\r
      highlightedNode = null;\r
    }\r
  });\r
\r
  graph.data(data.value);\r
  graph.render();\r
\r
  // 自动居中显示\r
  graph.fitView();\r
  // 设置适当的缩放比例\r
  const zoom = graph.getZoom();\r
  if (zoom > 1) {\r
    graph.zoom(0.8);\r
  }\r
  clearTooltip();\r
}\r
\r
// 检查目标节点是否是源节点的子节点\r
function isDescendant(sourceNode, targetNode) {\r
  if (!sourceNode.children) return false;\r
\r
  for (const child of sourceNode.children) {\r
    if (child.id === targetNode.id) return true;\r
    if (isDescendant(child, targetNode)) return true;\r
  }\r
\r
  return false;\r
}\r
\r
// 移动节点\r
function moveNode(sourceNode, targetNode) {\r
  // 从原位置删除节点\r
  const sourceParent = findParentNode(data.value, sourceNode.id);\r
  if (sourceParent) {\r
    const index = sourceParent.children.findIndex(\r
      (child) => child.id === sourceNode.id\r
    );\r
    if (index !== -1) {\r
      sourceParent.children.splice(index, 1);\r
    }\r
  }\r
\r
  // 如果是拖拽到根节点，则添加到根节点的children中\r
  if (targetNode.id === "root") {\r
    data.value.children.push(sourceNode);\r
    // 清除父节点信息，使其成为顶级公司\r
    sourceNode.parentId = "";\r
    sourceNode.parentCreditCode = "";\r
  } else {\r
    // 添加到新位置\r
    targetNode.children = targetNode.children || [];\r
    targetNode.children.push(sourceNode);\r
    // 更新节点的父节点信息\r
    sourceNode.parentId = targetNode.id;\r
    sourceNode.parentCreditCode = targetNode.creditCode;\r
  }\r
\r
  // 重新渲染图形\r
  renderGraph();\r
}\r
\r
// 查找父节点\r
function findParentNode(root, targetId) {\r
  if (!root.children) return null;\r
\r
  for (const child of root.children) {\r
    if (child.id === targetId) {\r
      return root;\r
    }\r
    const found = findParentNode(child, targetId);\r
    if (found) return found;\r
  }\r
  return null;\r
}\r
\r
// 监听窗口大小变化，自动调整布局\r
window.addEventListener("resize", () => {\r
  if (graph) {\r
    graph.changeSize(\r
      container.value?.clientWidth || 1000,\r
      container.value?.clientHeight || 600\r
    );\r
    graph.fitView();\r
  }\r
});\r
\r
// 导出架构图\r
async function exportGraph() {\r
  if (!graph) return;\r
\r
  try {\r
    // 显示加载提示\r
    ElMessage.info("正在生成图片，请稍候...");\r
\r
    // 保存当前缩放和位置\r
    const zoom = graph.getZoom();\r
    const group = graph.getGroup();\r
    const bbox = group.getBBox();\r
    const center = {\r
      x: bbox.centerX,\r
      y: bbox.centerY,\r
    };\r
\r
    // 临时隐藏虚拟根节点\r
    const rootNode = graph.findById("root");\r
    if (rootNode) {\r
      rootNode.hide();\r
    }\r
\r
    // 调整到合适的大小\r
    graph.zoom(0.8);\r
    graph.fitView();\r
\r
    // 等待布局完成\r
    await new Promise((resolve) => setTimeout(resolve, 500));\r
\r
    // 导出图片\r
    const dataURL = graph.toDataURL("image/png", {});\r
\r
    // 创建下载链接\r
    const link = document.createElement("a");\r
    link.download = \`公司架构图_\${new Date().toLocaleDateString()}.png\`;\r
    link.href = dataURL;\r
    document.body.appendChild(link);\r
    link.click();\r
    document.body.removeChild(link);\r
\r
    // 显示虚拟根节点\r
    if (rootNode) {\r
      rootNode.show();\r
    }\r
\r
    // 恢复原来的缩放和位置\r
    graph.zoom(zoom);\r
    graph.moveTo(center.x, center.y);\r
\r
    // 重新初始化图表\r
    renderGraph();\r
\r
    ElMessage.success("导出成功");\r
  } catch (error) {\r
    console.error("导出失败:", error);\r
    ElMessage.error("导出失败，请重试");\r
  }\r
}\r
\r
// 数据查看弹窗\r
const showDataModal = ref(false);\r
\r
// 显示数据\r
function showData() {\r
  showDataModal.value = true;\r
}\r
\r
// 计算实际数据（不包含虚拟根节点）\r
const actualData = computed(() => {\r
  return {\r
    companies: data.value.children,\r
  };\r
});\r
\r
// 搜索相关\r
const searchKeyword = ref("");\r
const allCompanies = ref([]);\r
\r
// 获取所有公司名称\r
function getAllCompanies(node, path = []) {\r
  if (node.id !== "root") {\r
    allCompanies.value.push({\r
      value: node.name,\r
      id: node.id,\r
      path: [...path, node.id],\r
    });\r
  }\r
  if (node.children) {\r
    node.children.forEach((child) => {\r
      getAllCompanies(child, [...path, node.id]);\r
    });\r
  }\r
}\r
\r
// 搜索建议\r
function querySearch(queryString, cb) {\r
  const results = queryString\r
    ? allCompanies.value.filter((item) =>\r
        item.value.toLowerCase().includes(queryString.toLowerCase())\r
      )\r
    : allCompanies.value;\r
  cb(results);\r
}\r
\r
// 高亮显示公司分支\r
function highlightCompanyBranch(path) {\r
  if (!graph) return;\r
\r
  // 重置所有节点样式\r
  graph.getNodes().forEach((node) => {\r
    const model = node.getModel();\r
\r
    node.getContainer().findAll((shape) => {\r
      if (shape.cfg && shape.cfg.className === "custom-html") return;\r
      if (model.id === "root") {\r
        return;\r
      }\r
      shape.attr("opacity", 0.5);\r
      shape.attr("stroke", "#1890ff");\r
      shape.attr("lineWidth", 1);\r
      shape.attr("fill", "#ffffff");\r
      shape.attr("shadowColor", "#ffffff");\r
      shape.attr("shadowBlur", 0);\r
    });\r
  });\r
\r
  // 获取路径中的第一个节点（顶级公司）\r
  const firstNodeId = path[0];\r
  const firstNode = graph.findById(firstNodeId);\r
\r
  // 高亮显示路径上的节点\r
  path.forEach((id) => {\r
    const node = graph.findById(id);\r
    if (node) {\r
      console.log(1111111, node);\r
      if (node.getModel().id === "root") return;\r
      node.getContainer().findAll((shape) => {\r
        if (shape.cfg && shape.cfg.className === "custom-html") return;\r
\r
        shape.attr("opacity", 1);\r
        shape.attr("stroke", "#52c41a");\r
        shape.attr("lineWidth", 2);\r
        shape.attr("fill", "#f6ffed");\r
        shape.attr("shadowColor", "#52c41a");\r
        shape.attr("shadowBlur", 10);\r
      });\r
    }\r
  });\r
\r
  // 高亮显示路径上的边\r
  graph.getEdges().forEach((edge) => {\r
    const model = edge.getModel();\r
    if (model.source === "root" || model.target === "root") return;\r
    if (path.includes(model.source) && path.includes(model.target)) {\r
      edge.getContainer().findAll((shape) => {\r
        shape.attr("stroke", "#52c41a");\r
        shape.attr("lineWidth", 2);\r
        shape.attr("opacity", 1);\r
        shape.attr("shadowColor", "#52c41a");\r
        shape.attr("shadowBlur", 5);\r
      });\r
    } else {\r
      edge.getContainer().findAll((shape) => {\r
        shape.attr("stroke", "#1890ff");\r
        shape.attr("lineWidth", 1);\r
        shape.attr("opacity", 0.2);\r
        shape.attr("shadowColor", "transparent");\r
        shape.attr("shadowBlur", 0);\r
      });\r
    }\r
  });\r
\r
  // 调整视图以聚焦于高亮的分支\r
  const nodes = path.map((id) => graph.findById(id)).filter(Boolean);\r
  if (nodes.length > 0) {\r
    // 计算从第一个节点到最后一个节点的边界框\r
    const bbox = graph.getGroupBBox(nodes);\r
    // 调整视图以显示整个分支\r
    graph.fitView({\r
      padding: [50, 50, 50, 50],\r
      group: nodes,\r
    });\r
  }\r
  renderGraph();\r
}\r
\r
// 处理选择\r
function handleSelect(item) {\r
  // 高亮显示选中的公司及其分支\r
  highlightCompanyBranch(item.path);\r
  // 重新初始化图表以应用新的样式\r
}\r
\r
// 初始化时获取所有公司\r
onMounted(() => {\r
  updateCompanyOptions();\r
  getAllCompanies(data.value);\r
  renderGraph();\r
});\r
\r
// 监听搜索关键词变化\r
watch(searchKeyword, (newVal) => {\r
  if (!newVal) {\r
    // 如果清空搜索，恢复所有节点显示\r
    if (graph) {\r
      graph.getNodes().forEach((node) => {\r
        const model = node.getModel();\r
        node.getContainer().findAll((shape) => {\r
          if (shape.cfg && shape.cfg.className === "custom-html") return;\r
          if (model.id === "root") {\r
            shape.attr("opacity", 1);\r
          }\r
          shape.attr("opacity", 1);\r
          shape.attr("stroke", "#1890ff");\r
          shape.attr("lineWidth", 1);\r
          shape.attr("fill", "#ffffff");\r
          shape.attr("shadowColor", "transparent");\r
          shape.attr("shadowBlur", 0);\r
        });\r
      });\r
      graph.getEdges().forEach((edge) => {\r
        edge.getContainer().findAll((shape) => {\r
          shape.attr("stroke", "#1890ff");\r
          shape.attr("lineWidth", 1);\r
          shape.attr("opacity", 1);\r
          shape.attr("shadowColor", "transparent");\r
          shape.attr("shadowBlur", 0);\r
        });\r
      });\r
      // 重新初始化图表\r
      renderGraph();\r
    }\r
  }\r
});\r
<\/script>\r
\r
<style lang="less" scoped>\r
.page {\r
  background: #f6f8fa;\r
  height: 90%;\r
  width: 95%;\r
  border-radius: 20px;\r
  position: relative;\r
}\r
\r
.toolbar {\r
  position: absolute;\r
  top: 20px;\r
  left: 20px;\r
  z-index: 100;\r
  background: #fff;\r
  padding: 8px 16px;\r
  border-radius: 8px;\r
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);\r
  display: flex;\r
  gap: 8px;\r
  align-items: center;\r
\r
  .search-input {\r
    width: 240px;\r
    margin-right: 8px;\r
  }\r
\r
  .el-button {\r
    display: flex;\r
    align-items: center;\r
    gap: 4px;\r
\r
    .el-icon {\r
      margin-right: 4px;\r
    }\r
  }\r
}\r
\r
h2 {\r
  color: #1890ff;\r
  margin-bottom: 20px;\r
}\r
.org-tree-container {\r
  width: 100%;\r
  height: 100%;\r
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);\r
  border-radius: 16px;\r
  box-shadow: 0 4px 24px rgba(24, 144, 255, 0.1);\r
  margin-bottom: 30px;\r
  overflow: auto;\r
  position: relative;\r
}\r
.unit {\r
  margin-left: 8px;\r
  color: #666;\r
}\r
:deep(.el-dialog__body) {\r
  padding: 20px 30px;\r
}\r
:deep(.el-form-item__label) {\r
  font-weight: 500;\r
}\r
:deep(.el-input-number) {\r
  width: 180px;\r
}\r
\r
.data-view {\r
  background: #f8f9fa;\r
  padding: 16px;\r
  border-radius: 8px;\r
  font-family: monospace;\r
  font-size: 14px;\r
  line-height: 1.5;\r
  white-space: pre-wrap;\r
  word-break: break-all;\r
  height: 500px;\r
  overflow: auto;\r
}\r
\r
.custom-tree-node {\r
  font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro",\r
    monospace;\r
  font-size: 14px;\r
  line-height: 1.5;\r
  padding: 2px 0;\r
\r
  .node-key {\r
    color: #881391;\r
    font-weight: 500;\r
  }\r
\r
  .node-value {\r
    &.string {\r
      color: #1a1aa6;\r
    }\r
\r
    &.number {\r
      color: #1c00cf;\r
    }\r
\r
    &.boolean {\r
      color: #0000ff;\r
    }\r
\r
    &.null {\r
      color: #808080;\r
    }\r
\r
    &.object {\r
      color: #808080;\r
    }\r
\r
    &.array {\r
      color: #808080;\r
    }\r
  }\r
}\r
\r
:deep(.el-tree-node__content) {\r
  height: auto;\r
  padding: 2px 0;\r
}\r
\r
:deep(.el-tree-node__expand-icon) {\r
  color: #666;\r
}\r
\r
:deep(.el-tree-node__content:hover) {\r
  background-color: #f5f7fa;\r
}\r
\r
.json-viewer {\r
  background: #1e1e1e;\r
  border-radius: 8px;\r
  height: 500px;\r
  position: relative;\r
  display: flex;\r
  flex-direction: column;\r
\r
  .json-toolbar {\r
    position: sticky;\r
    top: 0;\r
    z-index: 10;\r
    background: #1e1e1e;\r
    padding: 16px;\r
    display: flex;\r
    justify-content: flex-end;\r
    border-bottom: 1px solid #333;\r
  }\r
\r
  .json-content {\r
    flex: 1;\r
    overflow: auto;\r
    padding: 0 16px 16px;\r
  }\r
}\r
\r
:deep(.vjs-tree) {\r
  font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro",\r
    monospace;\r
  font-size: 14px;\r
  line-height: 1.5;\r
  color: #d4d4d4;\r
  background: transparent;\r
}\r
\r
:deep(.vjs-tree-node) {\r
  padding: 2px 0;\r
}\r
\r
:deep(.vjs-value) {\r
  &.vjs-value-string {\r
    color: #ce9178;\r
  }\r
\r
  &.vjs-value-number {\r
    color: #b5cea8;\r
  }\r
\r
  &.vjs-value-boolean {\r
    color: #569cd6;\r
  }\r
\r
  &.vjs-value-null {\r
    color: #569cd6;\r
  }\r
}\r
\r
:deep(.vjs-key) {\r
  color: #9cdcfe;\r
}\r
\r
:deep(.vjs-bracket) {\r
  color: #d4d4d4;\r
}\r
\r
:deep(.vjs-comma) {\r
  color: #d4d4d4;\r
}\r
\r
:deep(.vjs-toggle) {\r
  color: #666;\r
  transition: color 0.2s;\r
\r
  &:hover {\r
    color: #9cdcfe;\r
  }\r
}\r
\r
:deep(.vjs-line-number) {\r
  color: #858585;\r
  margin-right: 8px;\r
}\r
\r
:deep(.el-dialog__body) {\r
  padding: 20px;\r
}\r
\r
:deep(.el-dialog) {\r
  border-radius: 12px;\r
  overflow: hidden;\r
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);\r
\r
  .el-dialog__header {\r
    margin: 0;\r
    padding: 20px 24px;\r
    background: #f8f9fa;\r
    border-bottom: 1px solid #ebeef5;\r
\r
    .el-dialog__title {\r
      font-size: 18px;\r
      font-weight: 600;\r
      color: #1f2937;\r
    }\r
\r
    .el-dialog__headerbtn {\r
      top: 20px;\r
      right: 20px;\r
\r
      .el-dialog__close {\r
        font-size: 18px;\r
        color: #909399;\r
        transition: all 0.3s;\r
\r
        &:hover {\r
          color: #1890ff;\r
          transform: rotate(90deg);\r
        }\r
      }\r
    }\r
  }\r
\r
  .el-dialog__body {\r
    padding: 24px;\r
  }\r
\r
  .el-dialog__footer {\r
    padding: 16px 24px;\r
    background: #f8f9fa;\r
    border-top: 1px solid #ebeef5;\r
  }\r
}\r
\r
:deep(.el-form) {\r
  .el-form-item {\r
    margin-bottom: 24px;\r
\r
    &:last-child {\r
      margin-bottom: 0;\r
    }\r
\r
    .el-form-item__label {\r
      font-weight: 500;\r
      color: #1f2937;\r
      padding-right: 16px;\r
    }\r
\r
    .el-input,\r
    .el-select,\r
    .el-input-number {\r
      width: 100%;\r
\r
      .el-input__wrapper {\r
        box-shadow: 0 0 0 1px #dcdfe6 inset;\r
        transition: all 0.3s;\r
\r
        &:hover {\r
          box-shadow: 0 0 0 1px #1890ff inset;\r
        }\r
\r
        &.is-focus {\r
          box-shadow: 0 0 0 1px #1890ff inset;\r
        }\r
      }\r
    }\r
\r
    .el-radio-group {\r
      .el-radio {\r
        margin-right: 24px;\r
\r
        &:last-child {\r
          margin-right: 0;\r
        }\r
\r
        .el-radio__label {\r
          color: #606266;\r
        }\r
      }\r
    }\r
  }\r
}\r
\r
.dialog-footer {\r
  display: flex;\r
  justify-content: flex-end;\r
  gap: 12px;\r
\r
  .el-button {\r
    padding: 8px 20px;\r
    font-weight: 500;\r
    border-radius: 6px;\r
    transition: all 0.3s;\r
\r
    &:not(.el-button--primary) {\r
      border-color: #dcdfe6;\r
      color: #606266;\r
\r
      &:hover {\r
        color: #1890ff;\r
        border-color: #1890ff;\r
        background: #f0f7ff;\r
      }\r
    }\r
\r
    &.el-button--primary {\r
      background: #1890ff;\r
      border-color: #1890ff;\r
\r
      &:hover {\r
        background: #40a9ff;\r
        border-color: #40a9ff;\r
      }\r
    }\r
  }\r
}\r
\r
.node-tooltip {\r
  position: absolute;\r
  background: rgba(0, 0, 0, 0.8);\r
  color: white;\r
  padding: 4px 8px;\r
  border-radius: 4px;\r
  font-size: 14px;\r
  z-index: 1000;\r
  pointer-events: none;\r
  white-space: nowrap;\r
  transform: translate(-50%, -100%);\r
  margin-top: -8px;\r
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\r
  transition: opacity 0.2s;\r
}\r
</style>\r
`;export{r as default};
