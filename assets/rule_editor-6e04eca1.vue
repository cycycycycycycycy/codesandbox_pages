<template>
  <div class="rule-designer">
    <div class="container">
      <!-- 左侧：字段和运算符 -->
      <div class="panel panel-glass">
        <div class="panel-header">
          <i class="iconfont icon-fields"></i>
          <span>字段与运算符</span>
        </div>

        <div class="field-input" style="flex-wrap: wrap">
          <input
            type="text"
            v-model="newFieldLabel"
            style="width: 100%"
            placeholder="字段显示名（label）"
          />
          <input
            type="text"
            v-model="newFieldValue"
            style="width: 100%"
            placeholder="字段存储值（value）"
          />

          <button @click="addField" class="add-btn">添加字段</button>
        </div>
        <div class="operator-title">
          <i class="iconfont icon-operator"></i>
          <span>字段</span>
        </div>
        <div
          class="field-panel"
          style="position: relative; height: 200px; overflow: auto"
        >
          <transition-group name="fade" tag="div" v-if="fields.length > 0">
            <div
              v-for="field in fields"
              :key="field.value"
              class="field-tag field-tag-list"
              @click="insertField(field)"
              draggable="true"
              @dragstart="dragField($event, field)"
              @mouseenter="hoveredField = field.value"
              @mouseleave="hoveredField = null"
            >
              <i class="iconfont icon-tag"></i>
              {{ field.label }}
              <!-- 删除按钮，鼠标悬浮时显示 -->
              <span
                v-if="hoveredField === field.value"
                class="delete-field-btn"
                @click.stop="deleteField(field)"
                title="删除字段"
                >×</span
              >
            </div>
          </transition-group>
          <div
            v-else
            class="no-fields-tip"
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 32px 0;
              color: #b2aaff;
              background: rgba(245, 248, 255, 0.7);
              border-radius: 10px;
              min-height: 120px;
            "
          >
            <!-- SVG图标：空状态 -->
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="#f3f6fa"
                stroke="#b2aaff"
                stroke-width="2"
              />
              <path
                d="M16 30c0-4 8-4 8-8s-8-4-8-8"
                stroke="#b2aaff"
                stroke-width="2"
                stroke-linecap="round"
                fill="none"
              />
              <circle cx="24" cy="18" r="2" fill="#b2aaff" />
            </svg>
            <span
              style="
                margin-top: 16px;
                font-size: 1.08rem;
                color: #6c63ff;
                font-weight: 500;
              "
            >
              请先添加字段
            </span>
            <span style="margin-top: 6px; font-size: 0.95rem; color: #a0a0b2">
              点击上方输入框添加自定义字段
            </span>
          </div>
        </div>
        <div class="operator-section">
          <div class="operator-title">
            <i class="iconfont icon-operator"></i>
            <span>运算符</span>
          </div>
          <div class="operator-panel">
            <button
              v-for="op in operators"
              :key="op"
              class="operator-btn"
              @click="insertOperator(op)"
              draggable="false"
            >
              {{ op }}
            </button>
          </div>
        </div>
      </div>
      <!-- 中间：规则编辑器 -->
      <div class="panel panel-glass">
        <div class="panel-header">
          <i class="iconfont icon-editor"></i>
          <span>规则编辑器</span>
        </div>
        <div
          style="height: calc(100% - 80px)"
          class="editor"
          ref="ruleEditor"
          contenteditable
          @input="handleEditorInput"
          @keydown="handleKeyDown"
          @dragover.prevent
          @drop="handleDrop"
          @mouseup="highlightSelectedField"
        ></div>
      </div>
      <!-- 右侧：数据验证 -->
      <div class="panel panel-glass">
        <div class="panel-header">
          <i class="iconfont icon-validate"></i>
          <span>数据验证</span>
        </div>
        <div class="data-inputs" style="height: 350px; overflow: auto">
          <div v-for="field in fields" :key="field.value" class="data-input">
            <label>
              <i class="iconfont icon-field"></i>
              {{ field.label }}
            </label>
            <input
              type="text"
              v-model="dataValues[field.value]"
              :placeholder="`输入${field.label}值`"
            />
          </div>
        </div>
        <button @click="validate" class="validate-btn">
          <i class="iconfont icon-run"></i> 执行验证
        </button>
        <transition name="fade">
          <div class="result" v-if="validationResult">
            <div
              :class="[
                'result-message',
                validationResult.success ? 'success' : 'error',
              ]"
            >
              <i
                v-if="validationResult.success"
                class="iconfont icon-success"
              ></i>
              <i v-else class="iconfont icon-error"></i>
              {{
                validationResult.success
                  ? "验证通过"
                  : "错误：" + validationResult.error
              }}
            </div>
            <div v-if="validationResult.rule" class="result-details">
              <div>
                <b>执行规则：</b
                ><code
                  style="
                    display: block;
                    width: 240px !important;
                    word-wrap: break-word;
                  "
                  >{{ validationResult.rule }}</code
                >
              </div>
              <div v-if="validationResult.result !== undefined">
                <b>计算结果：</b>{{ validationResult.result }}
              </div>
              <div v-if="validationResult.ruleLabel">
                <b>存储值：</b
                ><code
                  style="
                    display: block;
                    width: 240px !important;
                    word-wrap: break-word;
                  "
                  >{{ validationResult.ruleLabel }}</code
                >
              </div>
              <div v-if="validationResult.storageRule">
                <b>存储值：</b
                ><code
                  style="
                    display: block;
                    width: 240px !important;
                    word-wrap: break-word;
                  "
                  >{{ validationResult.storageRule }}</code
                >
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";

// 字段列表，包含label和value
type FieldItem = { label: string; value: string };
const fields = ref<FieldItem[]>([]);
const newFieldLabel = ref("");
const newFieldValue = ref("");
const dataValues = reactive<{ [key: string]: string }>({});
const ruleEditor = ref<HTMLElement | null>(null);
const validationResult = ref<any>(null);
const hoveredField = ref<string | null>(null);

// 添加一个变量来存储最后的光标位置
const lastCaretPosition = ref<{ node: Node; offset: number } | null>(null);

// 运算符列表
const operators = [
  "+",
  "-",
  "*",
  "/",
  "==",
  "!=",
  ">",
  "<",
  "且",
  "或",
  "(",
  ")",
  "包含",
  "不包含",
];

// 添加字段
const addField = () => {
  const label = newFieldLabel.value.trim();
  const value = newFieldValue.value.trim();
  if (
    label &&
    value &&
    !fields.value.some((f) => f.label === label || f.value === value)
  ) {
    fields.value.push({ label, value });
    newFieldLabel.value = "";
    newFieldValue.value = "";
  }
};

// 删除字段，并从编辑器中移除所有相关标签
const deleteField = (field: FieldItem) => {
  // 1. 删除字段
  fields.value = fields.value.filter((f) => f.value !== field.value);
  // 2. 删除数据输入
  delete dataValues[field.value];
  // 3. 删除编辑器中所有相关的span
  if (ruleEditor.value) {
    const tags = ruleEditor.value.querySelectorAll(".field-tag");
    tags.forEach((tag) => {
      // @ts-ignore
      if (tag.dataset && tag.dataset.field === field.value) {
        tag.remove();
      }
    });
  }
};

// 插入字段
const insertField = (field: FieldItem) => {
  if (ruleEditor.value) {
    // 创建带有自定义样式的span标签用于显示字段
    const span = document.createElement("span");
    span.className = "field-tag";
    span.textContent = field.label;
    span.contentEditable = "false";
    span.dataset.field = field.value; // 存储值
    span.dataset.label = field.label; // 显示值
    // 额外添加内联样式，确保带样式显示
    span.style.display = "inline-flex";
    span.style.alignItems = "center";
    span.style.background = "linear-gradient(90deg, #e0e7ff 0%, #f3f6fa 100%)";
    span.style.border = "1.5px solid #b2aaff";
    span.style.borderRadius = "6px";
    span.style.padding = "4px 4px 4px 4px";
    span.style.color = "#6c63ff";
    span.style.fontWeight = "500";
    span.style.fontSize = "0.98rem";
    span.style.cursor = "pointer";
    span.style.userSelect = "none";
    // 让span可拖拽（字段可以拖拽）
    span.draggable = true;
    // 拖拽开始事件
    span.ondragstart = (e: DragEvent) => {
      e.dataTransfer?.setData("text/plain", JSON.stringify(field));
      // 标记为移动操作
      e.dataTransfer!.effectAllowed = "move";
      // 可选：高亮当前拖拽的字段
      highlightFieldTag(span);
      // 拖拽时将span从原位置移除，实现"移动"效果
      setTimeout(() => {
        if (span.parentNode) {
          span.parentNode.removeChild(span);
        }
      }, 0);
    };
    // 点击时高亮
    span.onclick = (e) => {
      highlightFieldTag(span);
      e.stopPropagation();
    };
    // 插入到光标处
    insertAtCaret(span);
  }
};

// 插入运算符（运算符不能被拖拽，只插入普通文本节点）
const insertOperator = (op: string) => {
  if (ruleEditor.value) {
    // 创建带有自定义样式的span标签用于显示运算符
    const span = document.createElement("span");
    span.className = "operator-tag";
    span.textContent = op;
    span.contentEditable = "false";
    span.dataset.operator = op;

    // 添加样式
    span.style.display = "inline-flex";
    span.style.alignItems = "center";
    span.style.padding = "0px 10px 0px 10px";
    span.style.fontWeight = "500";
    span.style.fontSize = "0.98rem";
    span.style.cursor = "pointer";
    span.style.userSelect = "none";
    span.style.margin = "4px 6px 4px 0";
    span.style.boxShadow = "0 1px 4px rgba(108, 99, 255, 0.04)";
    span.style.transition = "background 0.2s, box-shadow 0.2s";

    // 插入到光标处
    insertAtCaret(span);

    // 插入后重新记录光标位置
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      lastCaretPosition.value = {
        node: range.startContainer,
        offset: range.startOffset,
      };
    }
  }
};

// 拖拽处理
const dragField = (event: DragEvent, field: FieldItem) => {
  event.dataTransfer?.setData("text/plain", JSON.stringify(field));
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  const fieldStr = event.dataTransfer?.getData("text/plain");
  if (fieldStr) {
    try {
      const field: FieldItem = JSON.parse(fieldStr);
      insertField(field);
    } catch {
      // 兼容旧数据格式
      insertField({ label: fieldStr, value: fieldStr });
    }
  }
};

// 编辑器输入处理
const handleEditorInput = () => {
  if (ruleEditor.value) {
    // 记录当前光标位置
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      lastCaretPosition.value = {
        node: range.startContainer,
        offset: range.startOffset,
      };
    }

    // 原有的处理逻辑
    const tags = ruleEditor.value.querySelectorAll(".field-tag");
    tags.forEach((tag) => {
      if (
        tag.textContent?.replace(/^\s*[\u4e00-\u9fa5a-zA-Z0-9_]+\s*$/, "") !==
          "" &&
        tag.textContent !== tag.getAttribute("data-label")
      )
        tag.remove();
    });

    const operatorTags = ruleEditor.value.querySelectorAll(".operator-tag");
    operatorTags.forEach((tag) => {
      if (tag.textContent !== tag.getAttribute("data-operator")) {
        tag.remove();
      }
    });
  }
};

// 插入节点到光标处
function insertAtCaret(node: Node) {
  const sel = window.getSelection();
  if (!sel || !ruleEditor.value) return;
  let range = sel.getRangeAt(0);
  // 判断光标是否在编辑器内
  let editor = ruleEditor.value;
  if (!editor.contains(range.startContainer)) {
    editor.appendChild(node);
    return;
  }
  range.deleteContents();
  range.insertNode(node);
  // 插入后将光标移到节点后
  range.setStartAfter(node);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

// 字段标签高亮
function highlightFieldTag(target: HTMLElement) {
  if (!ruleEditor.value) return;
  // 先移除所有高亮
  ruleEditor.value.querySelectorAll(".field-tag.selected").forEach((el) => {
    el.classList.remove("selected");
  });
  // 给当前点击的加高亮
  target.classList.add("selected");
}

// 鼠标弹起时判断是否选中字段
const highlightSelectedField = (event: MouseEvent) => {
  if (!ruleEditor.value) return;
  // 获取当前选区
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  // 如果选区是字段标签，则高亮
  let node = range.startContainer;
  if (node.nodeType === 3) node = node.parentNode as Node;
  if (node instanceof HTMLElement && node.classList.contains("field-tag")) {
    highlightFieldTag(node);
  } else {
    // 否则移除所有高亮
    ruleEditor.value.querySelectorAll(".field-tag.selected").forEach((el) => {
      el.classList.remove("selected");
    });
  }
};

// 验证规则
const validate = () => {
  try {
    // 收集数据
    const data: { [key: string]: string } = {};
    fields.value.forEach((field) => {
      const value = dataValues[field.value];
      data[field.value] = isNaN(Number(value)) ? `'${value}'` : value;
    });

    // 构建规则（用于执行）
    let rule = Array.from(ruleEditor.value?.childNodes || [])
      .map((node) => {
        // @ts-ignore
        if (node.classList?.contains("field-tag")) {
          // @ts-ignore
          return data[node.dataset.field] || "null";
        }
        return node.textContent;
      })
      .join("")
      .replace(/且/g, "&&")
      .replace(/或/g, "||")
      .replace(/包含/g, ".includes")
      .replace(/不包含/g, "!.includes");

    // 构建存储值（只用字段value替换）
    let storageRule = Array.from(ruleEditor.value?.childNodes || [])
      .map((node) => {
        // @ts-ignore
        if (node.classList?.contains("field-tag")) {
          // @ts-ignore
          return node.dataset.field || "";
        }
        return node.textContent;
      })
      .join("")
      .replace(/且/g, "&&")
      .replace(/或/g, "||")
      .replace(/包含/g, ".includes")
      .replace(/不包含/g, "!.includes");

    // 处理字符串包含逻辑
    rule = rule.replace(/(\\w+)\\.includes/g, (match, p1) => {
      return `String(${p1}).toLowerCase().includes`;
    });
    storageRule = storageRule.replace(/(\\w+)\\.includes/g, (match, p1) => {
      return `String(${p1}).toLowerCase().includes`;
    });

    // 安全执行
    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${rule}`)();

    validationResult.value = {
      success: true,
      rule,
      result,
      storageRule,
    };
  } catch (e: any) {
    // 也要显示存储值
    let storageRule = Array.from(ruleEditor.value?.childNodes || [])
      .map((node) => {
        // @ts-ignore
        if (node.classList?.contains("field-tag")) {
          // @ts-ignore
          return node.dataset.field || "";
        }
        return node.textContent;
      })
      .join("")
      .replace(/且/g, "&&")
      .replace(/或/g, "||")
      .replace(/包含/g, ".includes")
      .replace(/不包含/g, "!.includes");
    storageRule = storageRule.replace(/(\\w+)\\.includes/g, (match, p1) => {
      return `String(${p1}).toLowerCase().includes`;
    });

    validationResult.value = {
      success: false,
      error: e.message,
      rule: ruleEditor.value?.innerText,
      storageRule,
    };
  }
};

// 添加 handleKeyDown 方法
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault(); // 阻止默认的回车行为
    // 插入换行符
    document.execCommand("insertLineBreak");
  }
};

// 添加回显数据展示功能
const displayRule = (rule: string, storageRule: string) => {
  if (!ruleEditor.value) return;

  // 清空编辑器
  ruleEditor.value.innerHTML = "";

  // 将规则按分号分割成多个子规则
  const subRules = rule.split(";");
  const storageSubRules = storageRule.split(";");

  subRules.forEach((subRule, index) => {
    if (index > 0) {
      // 添加分号分隔符
      const semicolon = document.createElement("span");
      semicolon.textContent = ";";
      semicolon.className = "operator-tag";
      semicolon.dataset.operator = ";";
      ruleEditor.value.appendChild(semicolon);

      // 添加换行符
      const lineBreak = document.createElement("br");
      ruleEditor.value.appendChild(lineBreak);
    }

    // 解析子规则
    const storageRule = storageSubRules[index];

    // 使用正则表达式匹配字段和运算符
    const pattern =
      /([A-Za-z][A-Za-z0-9]*)|([=<>!]+|包含|不包含|且|或|\(|\)|;)/g;
    let match;
    let lastMatchEnd = 0;
    let storageIndex = 0;

    while ((match = pattern.exec(subRule)) !== null) {
      // 处理匹配前的普通文本（包括数字）
      if (match.index > lastMatchEnd) {
        const text = subRule.substring(lastMatchEnd, match.index);
        if (text) {
          const textNode = document.createTextNode(text);
          ruleEditor.value.appendChild(textNode);
          // 更新storageIndex，跳过普通文本
          storageIndex += text.length;
        }
      }

      // 添加运算符
      if (match[2]) {
        const operator = document.createElement("span");
        operator.textContent = match[2];
        operator.className = "operator-tag";
        operator.dataset.operator = match[2];
        operator.contentEditable = "false";

        // 添加样式
        operator.style.display = "inline-flex";
        operator.style.alignItems = "center";
        operator.style.padding = "4px 10px 4px 10px";
        operator.style.fontWeight = "500";
        operator.style.fontSize = "0.98rem";
        operator.style.cursor = "pointer";
        operator.style.userSelect = "none";
        operator.style.margin = "4px 6px 4px 0";
        operator.style.boxShadow = "0 1px 4px rgba(108, 99, 255, 0.04)";
        operator.style.transition = "background 0.2s, box-shadow 0.2s";

        ruleEditor.value.appendChild(operator);
        storageIndex += match[2].length;
      }
      // 添加字段
      else if (match[1]) {
        const fieldLabel = match[1];
        let storageValue = "";
        let tempIndex = storageIndex;
        while (tempIndex < storageRule.length) {
          const char = storageRule[tempIndex];
          if (
            char === "=" ||
            char === ">" ||
            char === "<" ||
            char === "!" ||
            char === "且" ||
            char === "或" ||
            char === "(" ||
            char === ")" ||
            char === ";" ||
            char === "包" ||
            char === "不"
          ) {
            break;
          }
          storageValue += char;
          tempIndex++;
        }

        const field = {
          label: fieldLabel,
          value: storageValue,
        };

        const span = document.createElement("span");
        span.className = "field-tag";
        span.textContent = field.label;
        span.contentEditable = "false";
        span.dataset.field = field.value;
        span.dataset.label = field.label;

        // 添加样式
        span.style.display = "inline-flex";
        span.style.alignItems = "center";
        span.style.background =
          "linear-gradient(90deg, #e0e7ff 0%, #f3f6fa 100%)";
        span.style.border = "1.5px solid #b2aaff";
        span.style.borderRadius = "6px";
        span.style.padding = "4px 4px 4px 4px";
        span.style.color = "#6c63ff";
        span.style.fontWeight = "500";
        span.style.fontSize = "0.98rem";
        span.style.cursor = "pointer";
        span.style.userSelect = "none";
        span.style.margin = "4px 6px 4px 0";
        span.style.boxShadow = "0 1px 4px rgba(108, 99, 255, 0.04)";
        span.style.transition = "background 0.2s, box-shadow 0.2s";

        // 添加拖拽功能
        span.draggable = true;
        span.ondragstart = (e: DragEvent) => {
          e.dataTransfer?.setData("text/plain", JSON.stringify(field));
          e.dataTransfer!.effectAllowed = "move";
          highlightFieldTag(span);
          setTimeout(() => {
            if (span.parentNode) {
              span.parentNode.removeChild(span);
            }
          }, 0);
        };

        // 添加点击高亮
        span.onclick = (e) => {
          highlightFieldTag(span);
          e.stopPropagation();
        };

        ruleEditor.value.appendChild(span);
        storageIndex += storageValue.length;
      }

      lastMatchEnd = match.index + match[0].length;
    }

    // 处理最后一个匹配后的普通文本
    if (lastMatchEnd < subRule.length) {
      const text = subRule.substring(lastMatchEnd);
      if (text) {
        const textNode = document.createTextNode(text);
        ruleEditor.value.appendChild(textNode);
      }
    }
  });
};

// 初始化
onMounted(() => {
  fields.value.forEach((field) => {
    dataValues[field.value] = "";
  });
  // // 示例数据
  // const rule = "asdsasad==asdsa3sadaaa;asda123包含aaaaa3";
  // const storageRule =
  //   "C53SFSYDLFRDZYSYDW4_CTBNR1FZDW_53==C421FZZZGZXZDWBM3_C42ZYCYDW_44;C732DWMC6_CTBNR1FZDW_73包含C732DWMC6_C42ZYCYDW_74";

  // // 调用回显方法
  // displayRule(rule, storageRule);
});
</script>
<style scoped>
/* 删除按钮样式 */
.delete-field-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4d4f;
  color: #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  line-height: 16px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  z-index: 2;
  border: 1.5px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.delete-field-btn:hover {
  background: #d9363e;
}
.field-tag-list {
  position: relative;
  /* 保证删除按钮定位 */
}

/* 添加运算符标签样式 */
.operator-tag {
  display: inline-flex;
  align-items: center;
  padding: 0px 10px 0px 10px;
  font-weight: 500;
  font-size: 0.98rem;
  cursor: pointer;
  user-select: none;
  margin: 4px 6px 4px 0;
  box-shadow: 0 1px 4px rgba(108, 99, 255, 0.04);
  transition: background 0.2s, box-shadow 0.2s;
}
</style>

<style scoped>
/* 高级渐变背景和毛玻璃效果 */
.rule-designer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  width: 95%;
  min-height: 90%;
  border-radius: 20px;
  background: linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%);
  padding: 40px 0;
  box-sizing: border-box;
  overflow-x: auto;
}

.container {
  display: grid;
  grid-template-columns: 340px 1fr 340px;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.panel {
  border-radius: 18px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
  padding: 32px 28px 28px 28px;
  background: rgba(255, 255, 255, 0.75);
  position: relative;
  transition: box-shadow 0.2s;
}

.panel-glass {
  backdrop-filter: blur(12px) saturate(1.2);
  border: 1.5px solid rgba(120, 144, 156, 0.12);
}

.panel-header {
  display: flex;
  align-items: center;
  font-size: 1.18rem;
  font-weight: 600;
  color: #2d3a4a;
  margin-bottom: 18px;
  letter-spacing: 0.5px;
  gap: 8px;
}

.iconfont {
  font-size: 1.2em;
  vertical-align: middle;
  color: #6c63ff;
}

.field-input {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.field-input input {
  flex: 1;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: #f3f6fa;
  font-size: 1rem;
  transition: box-shadow 0.2s;
  box-shadow: 0 1px 2px rgba(120, 144, 156, 0.04);
  outline: none;
}

.field-input input:focus {
  box-shadow: 0 0 0 2px #b2aaff;
}

.add-btn {
  padding: 0 10px;
  background: linear-gradient(90deg, #6c63ff 0%, #5eead4 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.08);
  transition: background 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* .add-btn:hover {
  background: linear-gradient(90deg, #5eead4 0%, #6c63ff 100%);
  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.12);
} */

.field-panel {
  margin-bottom: 18px;
  min-height: 36px;
}

.field-tag {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(90deg, #e0e7ff 0%, #f3f6fa 100%);
  color: #6c63ff;
  border-radius: 6px;
  padding: 4px 14px 4px 10px;
  margin: 4px 6px 4px 0;
  font-weight: 500;
  font-size: 0.98rem;
  border: 1.5px solid #b2aaff;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(108, 99, 255, 0.04);
}

.field-tag .iconfont {
  font-size: 1em;
  margin-right: 4px;
  color: #5eead4;
}

.field-tag.selected,
.editor .field-tag.selected {
  background: linear-gradient(90deg, #fffbe6 0%, #ffe7ba 100%);
  color: #d48806;
  border: 1.5px solid #faad14;
  box-shadow: 0 0 6px #faad1433;
}

.editor .field-tag {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(90deg, #e0e7ff 0%, #f3f6fa 100%);
  color: #6c63ff;
  border-radius: 6px;
  padding: 4px 14px 4px 10px;
  margin: 4px 6px 4px 0;
  font-weight: 500;
  font-size: 0.98rem;
  border: 1.5px solid #b2aaff;
  user-select: none;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}

.operator-section {
  margin-top: 10px;
}

.operator-title {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  color: #5b5b5b;
  margin-bottom: 8px;
  gap: 6px;
}

.operator-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.operator-btn {
  padding: 6px 18px;
  background: linear-gradient(90deg, #f3f6fa 0%, #e0e7ff 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #6c63ff;
  font-weight: 500;
  font-size: 1rem;
  box-shadow: 0 1px 2px rgba(120, 144, 156, 0.04);
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.operator-btn:hover {
  background: linear-gradient(90deg, #6c63ff 0%, #5eead4 100%);
  color: #fff;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.1);
}

.editor {
  width: 600px;
  min-height: 320px;
  border: 2.5px solid #b2aaff;
  border-radius: 12px;
  padding: 18px 16px;
  margin: 18px 0 0 0;
  background: rgba(255, 255, 255, 0.7);
  font-size: 1.08rem;
  font-family: "JetBrains Mono", "Fira Mono", "Menlo", "Consolas", monospace;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.04);
  transition: border 0.2s, box-shadow 0.2s;
  outline: none;
}

.editor:focus {
  border: 2.5px solid #6c63ff;
  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.1);
}

.data-inputs {
  margin-bottom: 18px;
}

.data-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.data-input label {
  flex: 0 0 80px;
  color: #6c63ff;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.data-input input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: #f3f6fa;
  font-size: 1rem;
  transition: box-shadow 0.2s;
  box-shadow: 0 1px 2px rgba(120, 144, 156, 0.04);
  outline: none;
}

.data-input input:focus {
  box-shadow: 0 0 0 2px #b2aaff;
}

.validate-btn {
  margin: 18px 0 0 0;
  padding: 10px 24px;
  background: linear-gradient(90deg, #6c63ff 0%, #5eead4 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.08rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.08);
  transition: background 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.validate-btn:hover {
  background: linear-gradient(90deg, #5eead4 0%, #6c63ff 100%);
  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.12);
}

.result {
  margin-top: 18px;
  padding: 18px 16px;
  background: rgba(236, 253, 245, 0.85);
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(34, 197, 94, 0.06);
  border: 1.5px solid #5eead4;
  animation: fadeIn 0.4s;
}

.result-message {
  display: flex;
  align-items: center;
  font-size: 1.08rem;
  font-weight: 600;
  margin-bottom: 8px;
  gap: 8px;
}

.result-message.success {
  color: #22c55e;
}

.result-message.error {
  color: #ef4444;
}

.result-message .iconfont {
  font-size: 1.3em;
}

.result-details {
  margin-top: 8px;
  font-size: 0.98rem;
  color: #374151;
}

.result-details code {
  background: #f3f6fa;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: "JetBrains Mono", "Fira Mono", "Menlo", "Consolas", monospace;
  color: #6c63ff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
