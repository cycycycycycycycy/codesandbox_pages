<template>
  <div class="page">
    <div class="toolbar">
      <el-autocomplete
        v-model="searchKeyword"
        :fetch-suggestions="querySearch"
        placeholder="请输入公司名称搜索"
        class="search-input"
        @select="handleSelect"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-autocomplete>
      <el-button type="primary" @click="exportGraph">
        <el-icon><Download /></el-icon>
        导出架构图
      </el-button>
      <el-button type="success" @click="showData">
        <el-icon><View /></el-icon>
        查看数据
      </el-button>
    </div>
    <div ref="container" class="org-tree-container"></div>
    <!-- 编辑弹窗 -->
    <el-dialog
      v-model="showModal"
      :title="
        modalType === 'edit'
          ? '编辑公司'
          : currentNode?.id === 'root'
          ? '新增集团公司'
          : '新增子公司'
      "
      width="550px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="200px" :rules="rules" ref="formRef">
        <el-form-item label="企业名称" prop="label">
          <el-input v-model="form.name" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="creditCode">
          <el-input
            v-model="form.creditCode"
            placeholder="请输入统一社会信用代码"
          />
        </el-form-item>
        <el-form-item
          v-if="
            (modalType === 'add' && currentNode?.id !== 'root') ||
            (modalType === 'edit' && form.parentId)
          "
          label="母公司统一社会信用代码"
          prop="parentCreditCode"
        >
          <el-input
            v-model="form.parentCreditCode"
            placeholder="请输入母公司统一社会信用代码"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          v-if="
            (modalType === 'add' && currentNode?.id !== 'root') ||
            (modalType === 'edit' && form.parentId)
          "
          label="所属母公司"
          prop="parentId"
        >
          <el-select
            style="width: 100%"
            v-model="form.parentId"
            placeholder="请选择所属母公司"
            :disabled="true"
          >
            <el-option
              v-for="item in companyOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否纳入母公司报表" prop="isIncluded">
          <el-radio-group v-model="form.isIncluded">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="母公司股份占比" prop="percent">
          <el-input-number
            style="width: 60%"
            v-model="form.percent"
            :min="0"
            :max="100"
            :precision="2"
            :step="0.1"
          />
          <span class="unit">%</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showModal = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 数据查看弹窗 -->
    <json-viewer
      v-model="showDataModal"
      :data="actualData"
      title="树形结构数据"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import G6 from "@antv/g6";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Download,
  View,
  Expand,
  Fold,
  CopyDocument,
  ArrowDown,
  ArrowRight,
  Search,
} from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import JsonViewer from "./components/JsonViewer.vue";

// 构造初始数据
const data = ref({
  id: "root",
  children: [
    {
      id: "1",
      name: "先正达集团股份有限公司",
      creditCode: "91110000100000000",
      parentCreditCode: "",
      parentId: "",
      isIncluded: true,
      percent: 100,
      children: [
        {
          id: "2",
          name: "中国种子集团有限公司",
          creditCode: "91110000200000000",
          parentCreditCode: "91110000100000000",
          parentId: "1",
          isIncluded: true,
          percent: 100,
          children: [
            {
              id: "3",
              name: "中种农业科技（湖南）有限公司",
              creditCode: "91110000300000000",
              parentCreditCode: "91110000200000000",
              parentId: "2",
              isIncluded: true,
              percent: 100,
              children: [],
            },
            {
              id: "4",
              name: "中种国际种子有限公司",
              creditCode: "91110000400000000",
              parentCreditCode: "91110000200000000",
              parentId: "2",
              isIncluded: true,
              percent: 100,
              children: [],
            },
            {
              id: "5",
              name: "安徽江淮园艺种业股份有限公司",
              creditCode: "91110000500000000",
              parentCreditCode: "91110000200000000",
              parentId: "2",
              isIncluded: false,
              percent: 98,
              children: [],
            },
            {
              id: "6",
              name: "山西大丰种业有限公司",
              creditCode: "91110000600000000",
              parentCreditCode: "91110000200000000",
              parentId: "2",
              isIncluded: true,
              percent: 100,
              children: [],
            },
            {
              id: "7",
              name: "广东省金稻种业有限公司",
              creditCode: "91110000700000000",
              parentCreditCode: "91110000200000000",
              parentId: "2",
              isIncluded: true,
              percent: 100,
              children: [],
            },
          ],
        },
        {
          id: "8",
          name: "三北种业有限公司",
          creditCode: "91110000800000000",
          parentCreditCode: "91110000100000000",
          parentId: "1",
          isIncluded: true,
          percent: 100,
          children: [],
        },
      ],
    },
    {
      id: "9",
      name: "另一个集团公司",
      creditCode: "91110000900000000",
      parentCreditCode: "",
      parentId: "",
      isIncluded: true,
      percent: 100,
      children: [
        {
          id: "10",
          name: "子公司A",
          creditCode: "91110000100000000",
          parentCreditCode: "91110000900000000",
          parentId: "9",
          isIncluded: true,
          percent: 100,
          children: [],
        },
        {
          id: "11",
          name: "子公司B",
          creditCode: "91110000110000000",
          parentCreditCode: "91110000900000000",
          parentId: "9",
          isIncluded: true,
          percent: 100,
          children: [],
        },
      ],
    },
  ],
});

const clearTooltip = () => {
  console.log("clearTooltip");
  // 清空所有tooltip

  // 获取所有带有 .node-tooltip 类的DOM元素并移除
  const tooltips = document.querySelectorAll(".node-tooltip");
  tooltips.forEach((tooltip) => {
    tooltip.parentNode && tooltip.parentNode.removeChild(tooltip);
  });
};
// 弹窗相关
const showModal = ref(false);
const modalType = ref("edit");
const formRef = ref();
const form = ref({
  id: "",
  name: "",
  label: "",
  creditCode: "",
  parentCreditCode: "",
  parentId: "",
  isIncluded: true,
  percent: 100,
});
let currentNode = null;

// G6实例
const container = ref(null);
let graph = null;

// 表单验证规则
const rules = {
  name: [
    { required: true, message: "请输入企业名称", trigger: "blur" },
    { min: 2, max: 50, message: "长度在 2 到 50 个字符", trigger: "blur" },
  ],
  creditCode: [
    { required: true, message: "请输入统一社会信用代码", trigger: "blur" },
    {
      required: true,
      message: "请输入正确的统一社会信用代码",
      trigger: "blur",
    },
  ],
  parentCreditCode: [
    {
      required: true,
      message: "请输入母公司统一社会信用代码",
      trigger: "blur",
    },
    {
      required: true,
      message: "请输入正确的统一社会信用代码",
      trigger: "blur",
    },
  ],
  parentId: [{ required: true, message: "请选择所属母公司", trigger: "blur" }],
  isIncluded: [
    { required: true, message: "请选择是否纳入母公司报表", trigger: "change" },
  ],
  percent: [
    { required: true, message: "请输入母公司股份占比", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 100,
      message: "占比必须在0-100之间",
      trigger: "blur",
    },
  ],
};

// 获取所有公司选项
const companyOptions = ref([]);

// 更新公司选项
function updateCompanyOptions() {
  const options = [];
  function traverse(node) {
    if (node.id !== "root") {
      options.push({
        id: node.id,
        label: node.name,
      });
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  traverse(data.value);
  companyOptions.value = options;
}

// 工具函数：递归查找节点
function findNodeById(node, id) {
  if (node.id === id) return node;
  if (!node.children) return null;
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

// 工具函数：递归删除节点
function deleteNodeById(node, id) {
  if (node.id === "root") {
    const idx = node.children.findIndex((child) => child.id === id);
    if (idx !== -1) {
      node.children.splice(idx, 1);
      return true;
    }
    for (const child of node.children) {
      if (deleteNodeById(child, id)) return true;
    }
  } else if (node.children) {
    const idx = node.children.findIndex((child) => child.id === id);
    if (idx !== -1) {
      node.children.splice(idx, 1);
      return true;
    }
    for (const child of node.children) {
      if (deleteNodeById(child, id)) return true;
    }
  }
  return false;
}

// 打开弹窗时设置表单数据
function openModal(type, node) {
  modalType.value = type;
  currentNode = node;

  if (type === "edit") {
    form.value = { ...node };
  } else {
    // 新增时的默认值
    const defaultForm = {
      id: "",
      name: "",
      label: "",
      creditCode: "",
      parentCreditCode: "",
      parentId: "",
      isIncluded: true,
      percent: 100,
    };

    // 如果是新增子公司（非根节点），则填充母公司信息
    if (node && node.id !== "root") {
      defaultForm.parentCreditCode = node.creditCode;
      defaultForm.parentId = node.id;
    }

    form.value = defaultForm;
  }
  showModal.value = true;
}

// 保存编辑/新增
async function handleSave() {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    if (modalType.value === "edit") {
      // 编辑
      const node = findNodeById(data.value, form.value.id);
      if (node) {
        Object.assign(node, form.value);
      }
    } else if (modalType.value === "add") {
      // 新增
      const parent = findNodeById(data.value, currentNode.id);
      if (parent) {
        const newId = Date.now().toString();
        parent.children = parent.children || [];
        parent.children.push({
          ...form.value,
          id: newId,
          children: [],
        });
      }
    }
    showModal.value = false;
    allCompanies.value = [];
    getAllCompanies(data.value);
    renderGraph();
  } catch (error) {
    console.error("表单验证失败:", error);
  }
}

// 渲染树图
function renderGraph() {
  searchKeyword.value = "";
  if (!container.value) return;
  if (graph) graph.destroy();

  graph = new G6.TreeGraph({
    container: container.value,
    width: container.value.clientWidth || 1000,
    height: container.value.clientHeight || 600,
    modes: {
      default: [
        "drag-canvas",
        "zoom-canvas",
        {
          type: "drag-node",
          enableDelegate: true,
          delegateStyle: {
            fill: "#f3f3f3",
            stroke: "#1890ff",
            lineDash: [5, 5],
            shadowColor: "#1890ff",
            shadowBlur: 10,
            opacity: 0.8,
          },
        },
      ],
    },
    defaultNode: {
      type: "rect",
      size: [220, 60],
      style: {
        fill: "#fff",
        stroke: "#1890ff",
        radius: 10,
        shadowColor: "#1890ff33",
        shadowBlur: 10,
      },
      labelCfg: {
        style: {
          fill: "#333",
          fontSize: 16,
          fontWeight: 600,
        },
      },
    },
    defaultEdge: {
      type: "cubic-horizontal",
      style: {
        stroke: "#1890ff",
        lineWidth: 2,
      },
    },
    layout: {
      type: "compactBox",
      direction: "LR",
      getId: (d) => d.id,
      getHeight: () => 60,
      getWidth: () => 220,
      getVGap: () => 30,
      getHGap: () => 60,
    },
  });

  // 自定义节点内容
  graph.node((node) => {
    // 虚拟根节点
    if (node.id === "root") {
      return {
        label: "新增集团公司",
        labelCfg: {
          style: {
            fill: "#1890ff",
            fontSize: 16,
            fontWeight: 700,
          },
        },
        style: {
          fill: "#fff",
          stroke: "#1890ff",
          radius: 10,
          shadowColor: "#1890ff33",
          shadowBlur: 10,
          cursor: "pointer",
        },
        draggable: false,
      };
    }

    const displayLabel =
      node.name.length > 10
        ? JSON.parse(JSON.stringify(node.name)).slice(0, 10) + "..."
        : node.name;
    return {
      label: displayLabel,
      name: node.name,
      labelCfg: {
        style: {
          fill: "#1890ff",
          fontSize: 16,
          fontWeight: 700,
          width: 220,
          height: 60,
        },
      },
      style: {
        cursor: "move",
        fill: "#fff",
        stroke: "#1890ff",
        radius: 10,
        shadowColor: "#1890ff33",
        shadowBlur: 10,
      },
      draggable: true,
    };
  });

  // 自定义边
  graph.edge((edge) => {
    // 不显示根节点的边
    if (edge.source === "root") {
      return {
        style: {
          stroke: "transparent",
        },
      };
    }
    return {
      type: "cubic-horizontal",
      style: {
        stroke: "#1890ff",
        lineWidth: 2,
      },
    };
  });

  // 渲染后自定义HTML内容
  graph.on("afterrender", () => {
    graph.getNodes().forEach((item) => {
      const model = item.getModel();
      const group = item.getContainer();
      // 清除旧的自定义内容
      group
        .findAll((el) => el.cfg && el.cfg.className === "custom-html")
        .forEach((el) => el.remove());

      // 虚拟根节点只显示新增按钮
      if (model.id === "root") {
        const shape = group.addShape("text", {
          attrs: {
            x: -60,
            y: 0,
            text: "➕",
            fontSize: 20,
            cursor: "pointer",
            fill: "#1890ff",
            textAlign: "center",
            textBaseline: "middle",
          },
          className: "custom-html",
          name: "add",
          draggable: false,
        });

        // 为新增按钮添加点击事件
        shape.on("click", (evt) => {
          evt.stopPropagation();
          openModal("add", { id: "root", creditCode: "" });
        });
        return;
      }

      // 添加备注、占比
      group.addShape("text", {
        attrs: {
          x: -100,
          y: 50,
          text: `${model.isIncluded ? "" : "不"}纳入母公司报表；母公司占比: ${
            model.percent
          }%`,
          fill: model.isIncluded ? "#52c41a" : "#faad14",
          fontSize: 13,
          fontWeight: 400,
        },
        className: "custom-html",
        draggable: false,
      });

      // 添加操作按钮（编辑、删除、新增）
      const btns = [
        { text: "➕", action: "add" },
        { text: "✏️", action: "edit" },
        { text: "🗑️", action: "delete" },
      ];

      // 计算按钮位置
      const btnSize = 16; // 按钮大小
      const btnSpacing = 8; // 按钮间距
      const totalWidth = btns.length * (btnSize + btnSpacing) - btnSpacing;
      const startX = 50; // 从右侧开始的位置

      btns.forEach((btn, i) => {
        const x = startX + i * (btnSize + btnSpacing);
        const shape = group.addShape("text", {
          attrs: {
            x: x - 10,
            y: 20,
            text: btn.text,
            fontSize: 14,
            cursor: "pointer",
            opacity: 0,
            fill: "#1890ff",
            textAlign: "center",
            textBaseline: "middle",
          },
          className: "custom-html",
          name: btn.action,
          draggable: false,
        });

        // 为每个按钮添加点击事件
        shape.on("click", (evt) => {
          evt.stopPropagation(); // 阻止事件冒泡
          const action = btn.action;
          if (action === "edit") {
            openModal("edit", model);
          } else if (action === "add") {
            openModal("add", model);
          } else if (action === "delete") {
            if (model.id === data.value.id) {
              ElMessage.warning("根节点不能删除！");
              return;
            }
            ElMessageBox.confirm("确定要删除该公司及其所有下级吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                deleteNodeById(data.value, model.id);
                renderGraph();
                ElMessage.success("删除成功");
              })
              .catch(() => {});
          }
        });
      });
    });
  });

  // 添加鼠标悬停事件
  graph.on("node:mouseenter", (evt) => {
    const group = evt.item.getContainer();
    const model = evt.item.getModel();

    // 虚拟根节点不显示悬停效果
    if (model.id === "root") return;

    // 如果显示的名称和实际名称不同，显示tooltip
    if (model.label !== model.name) {
      const bbox = evt.item.getBBox();
      const tooltip = document.createElement("div");
      tooltip.className = "node-tooltip";
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
        transform: translate(-50%, -100%);
        margin-top: -8px;
      `;
      tooltip.textContent = model.name;
      document.body.appendChild(tooltip);

      // 计算tooltip位置
      const point = graph.getPointByClient(evt.clientX, evt.clientY);
      const x = point.x;
      const y = bbox.minY - 10;

      tooltip.style.left = `${evt.clientX}px`;
      tooltip.style.top = `${evt.clientY - 30}px`;

      // 存储tooltip引用，以便在mouseleave时移除
      evt.item.set("tooltip", tooltip);
    }

    const shapes = group.findAll(
      (el) => el.cfg && el.cfg.className === "custom-html" && el.cfg.name
    );
    shapes.forEach((shape) => {
      shape.animate(
        {
          opacity: 1,
        },
        {
          duration: 200,
          easing: "easeCubic",
        }
      );
    });
  });

  // 添加鼠标离开事件
  graph.on("node:mouseleave", (evt) => {
    const group = evt.item.getContainer();
    const model = evt.item.getModel();

    // 虚拟根节点不显示悬停效果
    if (model.id === "root") return;

    // 移除tooltip
    const tooltip = evt.item.get("tooltip");
    if (tooltip) {
      document.body.removeChild(tooltip);
      evt.item.set("tooltip", null);
    }

    const shapes = group.findAll(
      (el) => el.cfg && el.cfg.className === "custom-html" && el.cfg.name
    );
    shapes.forEach((shape) => {
      shape.animate(
        {
          opacity: 0,
        },
        {
          duration: 200,
          easing: "easeCubic",
        }
      );
    });
  });

  // 添加节点点击事件
  graph.on("node:click", (evt) => {
    const model = evt.item.getModel();
    if (model.id === "root") {
      openModal("add", { id: "root", creditCode: "" });
    }
  });

  // 添加拖拽相关事件
  let draggedNode = null;
  let targetNode = null;
  let highlightedNode = null;

  // 开始拖拽
  graph.on("node:dragstart", (evt) => {
    const model = evt.item.getModel();
    if (model.id === "root") return;
    draggedNode = model;

    // 设置拖拽节点的样式
    evt.item.getContainer().findAll((shape) => {
      if (shape.cfg && shape.cfg.className === "custom-html") return;
      shape.attr("opacity", 0.5);
    });
  });

  // 拖拽过程中
  graph.on("node:drag", (evt) => {
    const point = { x: evt.x, y: evt.y };
    const nodes = graph.getNodes();
    let minDistance = Infinity;
    let nearestNode = null;

    // 清除之前的高亮
    if (highlightedNode) {
      highlightedNode.getContainer().findAll((shape) => {
        if (shape.cfg && shape.cfg.className === "custom-html") return;
        shape.attr("stroke", "#1890ff");
        shape.attr("lineWidth", 1);
      });
      highlightedNode = null;
    }

    // 计算最近的节点
    nodes.forEach((node) => {
      const model = node.getModel();
      if (model.id === draggedNode?.id) return;

      const bbox = node.getBBox();
      const centerX = bbox.centerX;
      const centerY = bbox.centerY;
      const distance = Math.sqrt(
        Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestNode = node;
      }
    });

    if (nearestNode && minDistance < 100) {
      const model = nearestNode.getModel();
      targetNode = model;
      highlightedNode = nearestNode;
      // 高亮目标节点
      nearestNode.getContainer().findAll((shape) => {
        if (shape.cfg && shape.cfg.className === "custom-html") return;
        shape.attr("stroke", "#52c41a");
        shape.attr("lineWidth", 2);
      });
    } else {
      targetNode = null;
    }
  });

  // 拖拽结束
  graph.on("node:dragend", (evt) => {
    console.log(evt);

    // 恢复所有节点样式
    graph.getNodes().forEach((node) => {
      node.getContainer().findAll((shape) => {
        console.log(shape.cfg.attrs.text);
        console.log(shape.attrs);

        if (shape.cfg && shape.cfg.className === "custom-html") return;
        shape.attr("stroke", "#1890ff");
        shape.attr("lineWidth", 1);
        shape.attr("opacity", 1);
        shape.attr("fontWeight", "300");
      });
    });
    if (!draggedNode || !targetNode) {
      draggedNode = null;
      targetNode = null;
      highlightedNode = null;
      return;
    }

    // 检查是否拖拽到自己的子节点上
    if (targetNode.id !== "root" && isDescendant(draggedNode, targetNode)) {
      ElMessage.warning("不能将节点拖拽到其子节点下！");
      draggedNode = null;
      targetNode = null;
      highlightedNode = null;
      return;
    }

    try {
      // 更新数据结构
      moveNode(draggedNode, targetNode);
      ElMessage.success("节点移动成功");
    } catch (error) {
      ElMessage.error("节点移动失败，请重试");
    } finally {
      draggedNode = null;
      targetNode = null;
      highlightedNode = null;
    }
  });

  graph.data(data.value);
  graph.render();

  // 自动居中显示
  graph.fitView();
  // 设置适当的缩放比例
  const zoom = graph.getZoom();
  if (zoom > 1) {
    graph.zoom(0.8);
  }
  clearTooltip();
}

// 检查目标节点是否是源节点的子节点
function isDescendant(sourceNode, targetNode) {
  if (!sourceNode.children) return false;

  for (const child of sourceNode.children) {
    if (child.id === targetNode.id) return true;
    if (isDescendant(child, targetNode)) return true;
  }

  return false;
}

// 移动节点
function moveNode(sourceNode, targetNode) {
  // 从原位置删除节点
  const sourceParent = findParentNode(data.value, sourceNode.id);
  if (sourceParent) {
    const index = sourceParent.children.findIndex(
      (child) => child.id === sourceNode.id
    );
    if (index !== -1) {
      sourceParent.children.splice(index, 1);
    }
  }

  // 如果是拖拽到根节点，则添加到根节点的children中
  if (targetNode.id === "root") {
    data.value.children.push(sourceNode);
    // 清除父节点信息，使其成为顶级公司
    sourceNode.parentId = "";
    sourceNode.parentCreditCode = "";
  } else {
    // 添加到新位置
    targetNode.children = targetNode.children || [];
    targetNode.children.push(sourceNode);
    // 更新节点的父节点信息
    sourceNode.parentId = targetNode.id;
    sourceNode.parentCreditCode = targetNode.creditCode;
  }

  // 重新渲染图形
  renderGraph();
}

// 查找父节点
function findParentNode(root, targetId) {
  if (!root.children) return null;

  for (const child of root.children) {
    if (child.id === targetId) {
      return root;
    }
    const found = findParentNode(child, targetId);
    if (found) return found;
  }
  return null;
}

// 监听窗口大小变化，自动调整布局
window.addEventListener("resize", () => {
  if (graph) {
    graph.changeSize(
      container.value?.clientWidth || 1000,
      container.value?.clientHeight || 600
    );
    graph.fitView();
  }
});

// 导出架构图
async function exportGraph() {
  if (!graph) return;

  try {
    // 显示加载提示
    ElMessage.info("正在生成图片，请稍候...");

    // 保存当前缩放和位置
    const zoom = graph.getZoom();
    const group = graph.getGroup();
    const bbox = group.getBBox();
    const center = {
      x: bbox.centerX,
      y: bbox.centerY,
    };

    // 临时隐藏虚拟根节点
    const rootNode = graph.findById("root");
    if (rootNode) {
      rootNode.hide();
    }

    // 调整到合适的大小
    graph.zoom(0.8);
    graph.fitView();

    // 等待布局完成
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 导出图片
    const dataURL = graph.toDataURL("image/png", {});

    // 创建下载链接
    const link = document.createElement("a");
    link.download = `公司架构图_${new Date().toLocaleDateString()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 显示虚拟根节点
    if (rootNode) {
      rootNode.show();
    }

    // 恢复原来的缩放和位置
    graph.zoom(zoom);
    graph.moveTo(center.x, center.y);

    // 重新初始化图表
    renderGraph();

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败，请重试");
  }
}

// 数据查看弹窗
const showDataModal = ref(false);

// 显示数据
function showData() {
  showDataModal.value = true;
}

// 计算实际数据（不包含虚拟根节点）
const actualData = computed(() => {
  return {
    companies: data.value.children,
  };
});

// 搜索相关
const searchKeyword = ref("");
const allCompanies = ref([]);

// 获取所有公司名称
function getAllCompanies(node, path = []) {
  if (node.id !== "root") {
    allCompanies.value.push({
      value: node.name,
      id: node.id,
      path: [...path, node.id],
    });
  }
  if (node.children) {
    node.children.forEach((child) => {
      getAllCompanies(child, [...path, node.id]);
    });
  }
}

// 搜索建议
function querySearch(queryString, cb) {
  const results = queryString
    ? allCompanies.value.filter((item) =>
        item.value.toLowerCase().includes(queryString.toLowerCase())
      )
    : allCompanies.value;
  cb(results);
}

// 高亮显示公司分支
function highlightCompanyBranch(path) {
  if (!graph) return;

  // 重置所有节点样式
  graph.getNodes().forEach((node) => {
    const model = node.getModel();

    node.getContainer().findAll((shape) => {
      if (shape.cfg && shape.cfg.className === "custom-html") return;
      if (model.id === "root") {
        return;
      }
      shape.attr("opacity", 0.5);
      shape.attr("stroke", "#1890ff");
      shape.attr("lineWidth", 1);
      shape.attr("fill", "#ffffff");
      shape.attr("shadowColor", "#ffffff");
      shape.attr("shadowBlur", 0);
    });
  });

  // 获取路径中的第一个节点（顶级公司）
  const firstNodeId = path[0];
  const firstNode = graph.findById(firstNodeId);

  // 高亮显示路径上的节点
  path.forEach((id) => {
    const node = graph.findById(id);
    if (node) {
      console.log(1111111, node);
      if (node.getModel().id === "root") return;
      node.getContainer().findAll((shape) => {
        if (shape.cfg && shape.cfg.className === "custom-html") return;

        shape.attr("opacity", 1);
        shape.attr("stroke", "#52c41a");
        shape.attr("lineWidth", 2);
        shape.attr("fill", "#f6ffed");
        shape.attr("shadowColor", "#52c41a");
        shape.attr("shadowBlur", 10);
      });
    }
  });

  // 高亮显示路径上的边
  graph.getEdges().forEach((edge) => {
    const model = edge.getModel();
    if (model.source === "root" || model.target === "root") return;
    if (path.includes(model.source) && path.includes(model.target)) {
      edge.getContainer().findAll((shape) => {
        shape.attr("stroke", "#52c41a");
        shape.attr("lineWidth", 2);
        shape.attr("opacity", 1);
        shape.attr("shadowColor", "#52c41a");
        shape.attr("shadowBlur", 5);
      });
    } else {
      edge.getContainer().findAll((shape) => {
        shape.attr("stroke", "#1890ff");
        shape.attr("lineWidth", 1);
        shape.attr("opacity", 0.2);
        shape.attr("shadowColor", "transparent");
        shape.attr("shadowBlur", 0);
      });
    }
  });

  // 调整视图以聚焦于高亮的分支
  const nodes = path.map((id) => graph.findById(id)).filter(Boolean);
  if (nodes.length > 0) {
    // 计算从第一个节点到最后一个节点的边界框
    const bbox = graph.getGroupBBox(nodes);
    // 调整视图以显示整个分支
    graph.fitView({
      padding: [50, 50, 50, 50],
      group: nodes,
    });
  }
  renderGraph();
}

// 处理选择
function handleSelect(item) {
  // 高亮显示选中的公司及其分支
  highlightCompanyBranch(item.path);
  // 重新初始化图表以应用新的样式
}

// 初始化时获取所有公司
onMounted(() => {
  updateCompanyOptions();
  getAllCompanies(data.value);
  renderGraph();
});

// 监听搜索关键词变化
watch(searchKeyword, (newVal) => {
  if (!newVal) {
    // 如果清空搜索，恢复所有节点显示
    if (graph) {
      graph.getNodes().forEach((node) => {
        const model = node.getModel();
        node.getContainer().findAll((shape) => {
          if (shape.cfg && shape.cfg.className === "custom-html") return;
          if (model.id === "root") {
            shape.attr("opacity", 1);
          }
          shape.attr("opacity", 1);
          shape.attr("stroke", "#1890ff");
          shape.attr("lineWidth", 1);
          shape.attr("fill", "#ffffff");
          shape.attr("shadowColor", "transparent");
          shape.attr("shadowBlur", 0);
        });
      });
      graph.getEdges().forEach((edge) => {
        edge.getContainer().findAll((shape) => {
          shape.attr("stroke", "#1890ff");
          shape.attr("lineWidth", 1);
          shape.attr("opacity", 1);
          shape.attr("shadowColor", "transparent");
          shape.attr("shadowBlur", 0);
        });
      });
      // 重新初始化图表
      renderGraph();
    }
  }
});
</script>

<style lang="less" scoped>
.page {
  background: #f6f8fa;
  height: 90%;
  width: 95%;
  border-radius: 20px;
  position: relative;
}

.toolbar {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
  background: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 8px;
  align-items: center;

  .search-input {
    width: 240px;
    margin-right: 8px;
  }

  .el-button {
    display: flex;
    align-items: center;
    gap: 4px;

    .el-icon {
      margin-right: 4px;
    }
  }
}

h2 {
  color: #1890ff;
  margin-bottom: 20px;
}
.org-tree-container {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(24, 144, 255, 0.1);
  margin-bottom: 30px;
  overflow: auto;
  position: relative;
}
.unit {
  margin-left: 8px;
  color: #666;
}
:deep(.el-dialog__body) {
  padding: 20px 30px;
}
:deep(.el-form-item__label) {
  font-weight: 500;
}
:deep(.el-input-number) {
  width: 180px;
}

.data-view {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  height: 500px;
  overflow: auto;
}

.custom-tree-node {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro",
    monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 2px 0;

  .node-key {
    color: #881391;
    font-weight: 500;
  }

  .node-value {
    &.string {
      color: #1a1aa6;
    }

    &.number {
      color: #1c00cf;
    }

    &.boolean {
      color: #0000ff;
    }

    &.null {
      color: #808080;
    }

    &.object {
      color: #808080;
    }

    &.array {
      color: #808080;
    }
  }
}

:deep(.el-tree-node__content) {
  height: auto;
  padding: 2px 0;
}

:deep(.el-tree-node__expand-icon) {
  color: #666;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f5f7fa;
}

.json-viewer {
  background: #1e1e1e;
  border-radius: 8px;
  height: 500px;
  position: relative;
  display: flex;
  flex-direction: column;

  .json-toolbar {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #1e1e1e;
    padding: 16px;
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #333;
  }

  .json-content {
    flex: 1;
    overflow: auto;
    padding: 0 16px 16px;
  }
}

:deep(.vjs-tree) {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", "source-code-pro",
    monospace;
  font-size: 14px;
  line-height: 1.5;
  color: #d4d4d4;
  background: transparent;
}

:deep(.vjs-tree-node) {
  padding: 2px 0;
}

:deep(.vjs-value) {
  &.vjs-value-string {
    color: #ce9178;
  }

  &.vjs-value-number {
    color: #b5cea8;
  }

  &.vjs-value-boolean {
    color: #569cd6;
  }

  &.vjs-value-null {
    color: #569cd6;
  }
}

:deep(.vjs-key) {
  color: #9cdcfe;
}

:deep(.vjs-bracket) {
  color: #d4d4d4;
}

:deep(.vjs-comma) {
  color: #d4d4d4;
}

:deep(.vjs-toggle) {
  color: #666;
  transition: color 0.2s;

  &:hover {
    color: #9cdcfe;
  }
}

:deep(.vjs-line-number) {
  color: #858585;
  margin-right: 8px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  .el-dialog__header {
    margin: 0;
    padding: 20px 24px;
    background: #f8f9fa;
    border-bottom: 1px solid #ebeef5;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .el-dialog__headerbtn {
      top: 20px;
      right: 20px;

      .el-dialog__close {
        font-size: 18px;
        color: #909399;
        transition: all 0.3s;

        &:hover {
          color: #1890ff;
          transform: rotate(90deg);
        }
      }
    }
  }

  .el-dialog__body {
    padding: 24px;
  }

  .el-dialog__footer {
    padding: 16px 24px;
    background: #f8f9fa;
    border-top: 1px solid #ebeef5;
  }
}

:deep(.el-form) {
  .el-form-item {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .el-form-item__label {
      font-weight: 500;
      color: #1f2937;
      padding-right: 16px;
    }

    .el-input,
    .el-select,
    .el-input-number {
      width: 100%;

      .el-input__wrapper {
        box-shadow: 0 0 0 1px #dcdfe6 inset;
        transition: all 0.3s;

        &:hover {
          box-shadow: 0 0 0 1px #1890ff inset;
        }

        &.is-focus {
          box-shadow: 0 0 0 1px #1890ff inset;
        }
      }
    }

    .el-radio-group {
      .el-radio {
        margin-right: 24px;

        &:last-child {
          margin-right: 0;
        }

        .el-radio__label {
          color: #606266;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .el-button {
    padding: 8px 20px;
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.3s;

    &:not(.el-button--primary) {
      border-color: #dcdfe6;
      color: #606266;

      &:hover {
        color: #1890ff;
        border-color: #1890ff;
        background: #f0f7ff;
      }
    }

    &.el-button--primary {
      background: #1890ff;
      border-color: #1890ff;

      &:hover {
        background: #40a9ff;
        border-color: #40a9ff;
      }
    }
  }
}

.node-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 1000;
  pointer-events: none;
  white-space: nowrap;
  transform: translate(-50%, -100%);
  margin-top: -8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: opacity 0.2s;
}
</style>
