const n=`<template>\r
  <div class="rule-designer">\r
    <div class="container">\r
      <!-- 左侧：字段和运算符 -->\r
      <div class="panel panel-glass">\r
        <div class="panel-header">\r
          <i class="iconfont icon-fields"></i>\r
          <span>字段与运算符</span>\r
        </div>\r
\r
        <div class="field-input" style="flex-wrap: wrap">\r
          <input\r
            type="text"\r
            v-model="newFieldLabel"\r
            style="width: 100%"\r
            placeholder="字段显示名（label）"\r
          />\r
          <input\r
            type="text"\r
            v-model="newFieldValue"\r
            style="width: 100%"\r
            placeholder="字段存储值（value）"\r
          />\r
\r
          <button @click="addField" class="add-btn">添加字段</button>\r
        </div>\r
        <div class="operator-title">\r
          <i class="iconfont icon-operator"></i>\r
          <span>字段</span>\r
        </div>\r
        <div\r
          class="field-panel"\r
          style="position: relative; height: 200px; overflow: auto"\r
        >\r
          <transition-group name="fade" tag="div" v-if="fields.length > 0">\r
            <div\r
              v-for="field in fields"\r
              :key="field.value"\r
              class="field-tag field-tag-list"\r
              @click="insertField(field)"\r
              draggable="true"\r
              @dragstart="dragField($event, field)"\r
              @mouseenter="hoveredField = field.value"\r
              @mouseleave="hoveredField = null"\r
            >\r
              <i class="iconfont icon-tag"></i>\r
              {{ field.label }}\r
              <!-- 删除按钮，鼠标悬浮时显示 -->\r
              <span\r
                v-if="hoveredField === field.value"\r
                class="delete-field-btn"\r
                @click.stop="deleteField(field)"\r
                title="删除字段"\r
                >×</span\r
              >\r
            </div>\r
          </transition-group>\r
          <div\r
            v-else\r
            class="no-fields-tip"\r
            style="\r
              display: flex;\r
              flex-direction: column;\r
              align-items: center;\r
              justify-content: center;\r
              padding: 32px 0;\r
              color: #b2aaff;\r
              background: rgba(245, 248, 255, 0.7);\r
              border-radius: 10px;\r
              min-height: 120px;\r
            "\r
          >\r
            <!-- SVG图标：空状态 -->\r
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">\r
              <circle\r
                cx="24"\r
                cy="24"\r
                r="22"\r
                fill="#f3f6fa"\r
                stroke="#b2aaff"\r
                stroke-width="2"\r
              />\r
              <path\r
                d="M16 30c0-4 8-4 8-8s-8-4-8-8"\r
                stroke="#b2aaff"\r
                stroke-width="2"\r
                stroke-linecap="round"\r
                fill="none"\r
              />\r
              <circle cx="24" cy="18" r="2" fill="#b2aaff" />\r
            </svg>\r
            <span\r
              style="\r
                margin-top: 16px;\r
                font-size: 1.08rem;\r
                color: #6c63ff;\r
                font-weight: 500;\r
              "\r
            >\r
              请先添加字段\r
            </span>\r
            <span style="margin-top: 6px; font-size: 0.95rem; color: #a0a0b2">\r
              点击上方输入框添加自定义字段\r
            </span>\r
          </div>\r
        </div>\r
        <div class="operator-section">\r
          <div class="operator-title">\r
            <i class="iconfont icon-operator"></i>\r
            <span>运算符</span>\r
          </div>\r
          <div class="operator-panel">\r
            <button\r
              v-for="op in operators"\r
              :key="op"\r
              class="operator-btn"\r
              @click="insertOperator(op)"\r
              draggable="false"\r
            >\r
              {{ op }}\r
            </button>\r
          </div>\r
        </div>\r
      </div>\r
      <!-- 中间：规则编辑器 -->\r
      <div class="panel panel-glass">\r
        <div class="panel-header">\r
          <i class="iconfont icon-editor"></i>\r
          <span>规则编辑器</span>\r
        </div>\r
        <div\r
          style="height: calc(100% - 80px)"\r
          class="editor"\r
          ref="ruleEditor"\r
          contenteditable\r
          @input="handleEditorInput"\r
          @keydown="handleKeyDown"\r
          @dragover.prevent\r
          @drop="handleDrop"\r
          @mouseup="highlightSelectedField"\r
        ></div>\r
      </div>\r
      <!-- 右侧：数据验证 -->\r
      <div class="panel panel-glass">\r
        <div class="panel-header">\r
          <i class="iconfont icon-validate"></i>\r
          <span>数据验证</span>\r
        </div>\r
        <div class="data-inputs" style="height: 350px; overflow: auto">\r
          <div v-for="field in fields" :key="field.value" class="data-input">\r
            <label>\r
              <i class="iconfont icon-field"></i>\r
              {{ field.label }}\r
            </label>\r
            <input\r
              type="text"\r
              v-model="dataValues[field.value]"\r
              :placeholder="\`输入\${field.label}值\`"\r
            />\r
          </div>\r
        </div>\r
        <button @click="validate" class="validate-btn">\r
          <i class="iconfont icon-run"></i> 执行验证\r
        </button>\r
        <transition name="fade">\r
          <div class="result" v-if="validationResult">\r
            <div\r
              :class="[\r
                'result-message',\r
                validationResult.success ? 'success' : 'error',\r
              ]"\r
            >\r
              <i\r
                v-if="validationResult.success"\r
                class="iconfont icon-success"\r
              ></i>\r
              <i v-else class="iconfont icon-error"></i>\r
              {{\r
                validationResult.success\r
                  ? "验证通过"\r
                  : "错误：" + validationResult.error\r
              }}\r
            </div>\r
            <div v-if="validationResult.rule" class="result-details">\r
              <div>\r
                <b>执行规则：</b\r
                ><code\r
                  style="\r
                    display: block;\r
                    width: 240px !important;\r
                    word-wrap: break-word;\r
                  "\r
                  >{{ validationResult.rule }}</code\r
                >\r
              </div>\r
              <div v-if="validationResult.result !== undefined">\r
                <b>计算结果：</b>{{ validationResult.result }}\r
              </div>\r
              <div v-if="validationResult.ruleLabel">\r
                <b>存储值：</b\r
                ><code\r
                  style="\r
                    display: block;\r
                    width: 240px !important;\r
                    word-wrap: break-word;\r
                  "\r
                  >{{ validationResult.ruleLabel }}</code\r
                >\r
              </div>\r
              <div v-if="validationResult.storageRule">\r
                <b>存储值：</b\r
                ><code\r
                  style="\r
                    display: block;\r
                    width: 240px !important;\r
                    word-wrap: break-word;\r
                  "\r
                  >{{ validationResult.storageRule }}</code\r
                >\r
              </div>\r
            </div>\r
          </div>\r
        </transition>\r
      </div>\r
    </div>\r
  </div>\r
</template>\r
<script setup lang="ts">\r
import { ref, reactive, onMounted, nextTick } from "vue";\r
\r
// 字段列表，包含label和value\r
type FieldItem = { label: string; value: string };\r
const fields = ref<FieldItem[]>([]);\r
const newFieldLabel = ref("");\r
const newFieldValue = ref("");\r
const dataValues = reactive<{ [key: string]: string }>({});\r
const ruleEditor = ref<HTMLElement | null>(null);\r
const validationResult = ref<any>(null);\r
const hoveredField = ref<string | null>(null);\r
\r
// 添加一个变量来存储最后的光标位置\r
const lastCaretPosition = ref<{ node: Node; offset: number } | null>(null);\r
\r
// 运算符列表\r
const operators = [\r
  "+",\r
  "-",\r
  "*",\r
  "/",\r
  "==",\r
  "!=",\r
  ">",\r
  "<",\r
  "且",\r
  "或",\r
  "(",\r
  ")",\r
  "包含",\r
  "不包含",\r
];\r
\r
// 添加字段\r
const addField = () => {\r
  const label = newFieldLabel.value.trim();\r
  const value = newFieldValue.value.trim();\r
  if (\r
    label &&\r
    value &&\r
    !fields.value.some((f) => f.label === label || f.value === value)\r
  ) {\r
    fields.value.push({ label, value });\r
    newFieldLabel.value = "";\r
    newFieldValue.value = "";\r
  }\r
};\r
\r
// 删除字段，并从编辑器中移除所有相关标签\r
const deleteField = (field: FieldItem) => {\r
  // 1. 删除字段\r
  fields.value = fields.value.filter((f) => f.value !== field.value);\r
  // 2. 删除数据输入\r
  delete dataValues[field.value];\r
  // 3. 删除编辑器中所有相关的span\r
  if (ruleEditor.value) {\r
    const tags = ruleEditor.value.querySelectorAll(".field-tag");\r
    tags.forEach((tag) => {\r
      // @ts-ignore\r
      if (tag.dataset && tag.dataset.field === field.value) {\r
        tag.remove();\r
      }\r
    });\r
  }\r
};\r
\r
// 插入字段\r
const insertField = (field: FieldItem) => {\r
  if (ruleEditor.value) {\r
    // 创建带有自定义样式的span标签用于显示字段\r
    const span = document.createElement("span");\r
    span.className = "field-tag";\r
    span.textContent = field.label;\r
    span.contentEditable = "false";\r
    span.dataset.field = field.value; // 存储值\r
    span.dataset.label = field.label; // 显示值\r
    // 额外添加内联样式，确保带样式显示\r
    span.style.display = "inline-flex";\r
    span.style.alignItems = "center";\r
    span.style.background = "linear-gradient(90deg, #e0e7ff 0%, #f3f6fa 100%)";\r
    span.style.border = "1.5px solid #b2aaff";\r
    span.style.borderRadius = "6px";\r
    span.style.padding = "4px 4px 4px 4px";\r
    span.style.color = "#6c63ff";\r
    span.style.fontWeight = "500";\r
    span.style.fontSize = "0.98rem";\r
    span.style.cursor = "pointer";\r
    span.style.userSelect = "none";\r
    // 让span可拖拽（字段可以拖拽）\r
    span.draggable = true;\r
    // 拖拽开始事件\r
    span.ondragstart = (e: DragEvent) => {\r
      e.dataTransfer?.setData("text/plain", JSON.stringify(field));\r
      // 标记为移动操作\r
      e.dataTransfer!.effectAllowed = "move";\r
      // 可选：高亮当前拖拽的字段\r
      highlightFieldTag(span);\r
      // 拖拽时将span从原位置移除，实现"移动"效果\r
      setTimeout(() => {\r
        if (span.parentNode) {\r
          span.parentNode.removeChild(span);\r
        }\r
      }, 0);\r
    };\r
    // 点击时高亮\r
    span.onclick = (e) => {\r
      highlightFieldTag(span);\r
      e.stopPropagation();\r
    };\r
    // 插入到光标处\r
    insertAtCaret(span);\r
  }\r
};\r
\r
// 插入运算符（运算符不能被拖拽，只插入普通文本节点）\r
const insertOperator = (op: string) => {\r
  if (ruleEditor.value) {\r
    // 创建带有自定义样式的span标签用于显示运算符\r
    const span = document.createElement("span");\r
    span.className = "operator-tag";\r
    span.textContent = op;\r
    span.contentEditable = "false";\r
    span.dataset.operator = op;\r
\r
    // 添加样式\r
    span.style.display = "inline-flex";\r
    span.style.alignItems = "center";\r
    span.style.padding = "0px 10px 0px 10px";\r
    span.style.fontWeight = "500";\r
    span.style.fontSize = "0.98rem";\r
    span.style.cursor = "pointer";\r
    span.style.userSelect = "none";\r
    span.style.margin = "4px 6px 4px 0";\r
    span.style.boxShadow = "0 1px 4px rgba(108, 99, 255, 0.04)";\r
    span.style.transition = "background 0.2s, box-shadow 0.2s";\r
\r
    // 插入到光标处\r
    insertAtCaret(span);\r
\r
    // 插入后重新记录光标位置\r
    const selection = window.getSelection();\r
    if (selection && selection.rangeCount > 0) {\r
      const range = selection.getRangeAt(0);\r
      lastCaretPosition.value = {\r
        node: range.startContainer,\r
        offset: range.startOffset,\r
      };\r
    }\r
  }\r
};\r
\r
// 拖拽处理\r
const dragField = (event: DragEvent, field: FieldItem) => {\r
  event.dataTransfer?.setData("text/plain", JSON.stringify(field));\r
};\r
\r
const handleDrop = (event: DragEvent) => {\r
  event.preventDefault();\r
  const fieldStr = event.dataTransfer?.getData("text/plain");\r
  if (fieldStr) {\r
    try {\r
      const field: FieldItem = JSON.parse(fieldStr);\r
      insertField(field);\r
    } catch {\r
      // 兼容旧数据格式\r
      insertField({ label: fieldStr, value: fieldStr });\r
    }\r
  }\r
};\r
\r
// 编辑器输入处理\r
const handleEditorInput = () => {\r
  if (ruleEditor.value) {\r
    // 记录当前光标位置\r
    const selection = window.getSelection();\r
    if (selection && selection.rangeCount > 0) {\r
      const range = selection.getRangeAt(0);\r
      lastCaretPosition.value = {\r
        node: range.startContainer,\r
        offset: range.startOffset,\r
      };\r
    }\r
\r
    // 原有的处理逻辑\r
    const tags = ruleEditor.value.querySelectorAll(".field-tag");\r
    tags.forEach((tag) => {\r
      if (\r
        tag.textContent?.replace(/^\\s*[\\u4e00-\\u9fa5a-zA-Z0-9_]+\\s*$/, "") !==\r
          "" &&\r
        tag.textContent !== tag.getAttribute("data-label")\r
      )\r
        tag.remove();\r
    });\r
\r
    const operatorTags = ruleEditor.value.querySelectorAll(".operator-tag");\r
    operatorTags.forEach((tag) => {\r
      if (tag.textContent !== tag.getAttribute("data-operator")) {\r
        tag.remove();\r
      }\r
    });\r
  }\r
};\r
\r
// 插入节点到光标处\r
function insertAtCaret(node: Node) {\r
  const sel = window.getSelection();\r
  if (!sel || !ruleEditor.value) return;\r
  let range = sel.getRangeAt(0);\r
  // 判断光标是否在编辑器内\r
  let editor = ruleEditor.value;\r
  if (!editor.contains(range.startContainer)) {\r
    editor.appendChild(node);\r
    return;\r
  }\r
  range.deleteContents();\r
  range.insertNode(node);\r
  // 插入后将光标移到节点后\r
  range.setStartAfter(node);\r
  range.collapse(true);\r
  sel.removeAllRanges();\r
  sel.addRange(range);\r
}\r
\r
// 字段标签高亮\r
function highlightFieldTag(target: HTMLElement) {\r
  if (!ruleEditor.value) return;\r
  // 先移除所有高亮\r
  ruleEditor.value.querySelectorAll(".field-tag.selected").forEach((el) => {\r
    el.classList.remove("selected");\r
  });\r
  // 给当前点击的加高亮\r
  target.classList.add("selected");\r
}\r
\r
// 鼠标弹起时判断是否选中字段\r
const highlightSelectedField = (event: MouseEvent) => {\r
  if (!ruleEditor.value) return;\r
  // 获取当前选区\r
  const sel = window.getSelection();\r
  if (!sel || sel.rangeCount === 0) return;\r
  const range = sel.getRangeAt(0);\r
  // 如果选区是字段标签，则高亮\r
  let node = range.startContainer;\r
  if (node.nodeType === 3) node = node.parentNode as Node;\r
  if (node instanceof HTMLElement && node.classList.contains("field-tag")) {\r
    highlightFieldTag(node);\r
  } else {\r
    // 否则移除所有高亮\r
    ruleEditor.value.querySelectorAll(".field-tag.selected").forEach((el) => {\r
      el.classList.remove("selected");\r
    });\r
  }\r
};\r
\r
// 验证规则\r
const validate = () => {\r
  try {\r
    // 收集数据\r
    const data: { [key: string]: string } = {};\r
    fields.value.forEach((field) => {\r
      const value = dataValues[field.value];\r
      data[field.value] = isNaN(Number(value)) ? \`'\${value}'\` : value;\r
    });\r
\r
    // 构建规则（用于执行）\r
    let rule = Array.from(ruleEditor.value?.childNodes || [])\r
      .map((node) => {\r
        // @ts-ignore\r
        if (node.classList?.contains("field-tag")) {\r
          // @ts-ignore\r
          return data[node.dataset.field] || "null";\r
        }\r
        return node.textContent;\r
      })\r
      .join("")\r
      .replace(/且/g, "&&")\r
      .replace(/或/g, "||")\r
      .replace(/包含/g, ".includes")\r
      .replace(/不包含/g, "!.includes");\r
\r
    // 构建存储值（只用字段value替换）\r
    let storageRule = Array.from(ruleEditor.value?.childNodes || [])\r
      .map((node) => {\r
        // @ts-ignore\r
        if (node.classList?.contains("field-tag")) {\r
          // @ts-ignore\r
          return node.dataset.field || "";\r
        }\r
        return node.textContent;\r
      })\r
      .join("")\r
      .replace(/且/g, "&&")\r
      .replace(/或/g, "||")\r
      .replace(/包含/g, ".includes")\r
      .replace(/不包含/g, "!.includes");\r
\r
    // 处理字符串包含逻辑\r
    rule = rule.replace(/(\\\\w+)\\\\.includes/g, (match, p1) => {\r
      return \`String(\${p1}).toLowerCase().includes\`;\r
    });\r
    storageRule = storageRule.replace(/(\\\\w+)\\\\.includes/g, (match, p1) => {\r
      return \`String(\${p1}).toLowerCase().includes\`;\r
    });\r
\r
    // 安全执行\r
    // eslint-disable-next-line no-new-func\r
    const result = new Function(\`return \${rule}\`)();\r
\r
    validationResult.value = {\r
      success: true,\r
      rule,\r
      result,\r
      storageRule,\r
    };\r
  } catch (e: any) {\r
    // 也要显示存储值\r
    let storageRule = Array.from(ruleEditor.value?.childNodes || [])\r
      .map((node) => {\r
        // @ts-ignore\r
        if (node.classList?.contains("field-tag")) {\r
          // @ts-ignore\r
          return node.dataset.field || "";\r
        }\r
        return node.textContent;\r
      })\r
      .join("")\r
      .replace(/且/g, "&&")\r
      .replace(/或/g, "||")\r
      .replace(/包含/g, ".includes")\r
      .replace(/不包含/g, "!.includes");\r
    storageRule = storageRule.replace(/(\\\\w+)\\\\.includes/g, (match, p1) => {\r
      return \`String(\${p1}).toLowerCase().includes\`;\r
    });\r
\r
    validationResult.value = {\r
      success: false,\r
      error: e.message,\r
      rule: ruleEditor.value?.innerText,\r
      storageRule,\r
    };\r
  }\r
};\r
\r
// 添加 handleKeyDown 方法\r
const handleKeyDown = (event: KeyboardEvent) => {\r
  if (event.key === "Enter") {\r
    event.preventDefault(); // 阻止默认的回车行为\r
    // 插入换行符\r
    document.execCommand("insertLineBreak");\r
  }\r
};\r
\r
// 添加回显数据展示功能\r
const displayRule = (rule: string, storageRule: string) => {\r
  if (!ruleEditor.value) return;\r
\r
  // 清空编辑器\r
  ruleEditor.value.innerHTML = "";\r
\r
  // 将规则按分号分割成多个子规则\r
  const subRules = rule.split(";");\r
  const storageSubRules = storageRule.split(";");\r
\r
  subRules.forEach((subRule, index) => {\r
    if (index > 0) {\r
      // 添加分号分隔符\r
      const semicolon = document.createElement("span");\r
      semicolon.textContent = ";";\r
      semicolon.className = "operator-tag";\r
      semicolon.dataset.operator = ";";\r
      ruleEditor.value.appendChild(semicolon);\r
\r
      // 添加换行符\r
      const lineBreak = document.createElement("br");\r
      ruleEditor.value.appendChild(lineBreak);\r
    }\r
\r
    // 解析子规则\r
    const storageRule = storageSubRules[index];\r
\r
    // 使用正则表达式匹配字段和运算符\r
    const pattern =\r
      /([A-Za-z][A-Za-z0-9]*)|([=<>!]+|包含|不包含|且|或|\\(|\\)|;)/g;\r
    let match;\r
    let lastMatchEnd = 0;\r
    let storageIndex = 0;\r
\r
    while ((match = pattern.exec(subRule)) !== null) {\r
      // 处理匹配前的普通文本（包括数字）\r
      if (match.index > lastMatchEnd) {\r
        const text = subRule.substring(lastMatchEnd, match.index);\r
        if (text) {\r
          const textNode = document.createTextNode(text);\r
          ruleEditor.value.appendChild(textNode);\r
          // 更新storageIndex，跳过普通文本\r
          storageIndex += text.length;\r
        }\r
      }\r
\r
      // 添加运算符\r
      if (match[2]) {\r
        const operator = document.createElement("span");\r
        operator.textContent = match[2];\r
        operator.className = "operator-tag";\r
        operator.dataset.operator = match[2];\r
        operator.contentEditable = "false";\r
\r
        // 添加样式\r
        operator.style.display = "inline-flex";\r
        operator.style.alignItems = "center";\r
        operator.style.padding = "4px 10px 4px 10px";\r
        operator.style.fontWeight = "500";\r
        operator.style.fontSize = "0.98rem";\r
        operator.style.cursor = "pointer";\r
        operator.style.userSelect = "none";\r
        operator.style.margin = "4px 6px 4px 0";\r
        operator.style.boxShadow = "0 1px 4px rgba(108, 99, 255, 0.04)";\r
        operator.style.transition = "background 0.2s, box-shadow 0.2s";\r
\r
        ruleEditor.value.appendChild(operator);\r
        storageIndex += match[2].length;\r
      }\r
      // 添加字段\r
      else if (match[1]) {\r
        const fieldLabel = match[1];\r
        let storageValue = "";\r
        let tempIndex = storageIndex;\r
        while (tempIndex < storageRule.length) {\r
          const char = storageRule[tempIndex];\r
          if (\r
            char === "=" ||\r
            char === ">" ||\r
            char === "<" ||\r
            char === "!" ||\r
            char === "且" ||\r
            char === "或" ||\r
            char === "(" ||\r
            char === ")" ||\r
            char === ";" ||\r
            char === "包" ||\r
            char === "不"\r
          ) {\r
            break;\r
          }\r
          storageValue += char;\r
          tempIndex++;\r
        }\r
\r
        const field = {\r
          label: fieldLabel,\r
          value: storageValue,\r
        };\r
\r
        const span = document.createElement("span");\r
        span.className = "field-tag";\r
        span.textContent = field.label;\r
        span.contentEditable = "false";\r
        span.dataset.field = field.value;\r
        span.dataset.label = field.label;\r
\r
        // 添加样式\r
        span.style.display = "inline-flex";\r
        span.style.alignItems = "center";\r
        span.style.background =\r
          "linear-gradient(90deg, #e0e7ff 0%, #f3f6fa 100%)";\r
        span.style.border = "1.5px solid #b2aaff";\r
        span.style.borderRadius = "6px";\r
        span.style.padding = "4px 4px 4px 4px";\r
        span.style.color = "#6c63ff";\r
        span.style.fontWeight = "500";\r
        span.style.fontSize = "0.98rem";\r
        span.style.cursor = "pointer";\r
        span.style.userSelect = "none";\r
        span.style.margin = "4px 6px 4px 0";\r
        span.style.boxShadow = "0 1px 4px rgba(108, 99, 255, 0.04)";\r
        span.style.transition = "background 0.2s, box-shadow 0.2s";\r
\r
        // 添加拖拽功能\r
        span.draggable = true;\r
        span.ondragstart = (e: DragEvent) => {\r
          e.dataTransfer?.setData("text/plain", JSON.stringify(field));\r
          e.dataTransfer!.effectAllowed = "move";\r
          highlightFieldTag(span);\r
          setTimeout(() => {\r
            if (span.parentNode) {\r
              span.parentNode.removeChild(span);\r
            }\r
          }, 0);\r
        };\r
\r
        // 添加点击高亮\r
        span.onclick = (e) => {\r
          highlightFieldTag(span);\r
          e.stopPropagation();\r
        };\r
\r
        ruleEditor.value.appendChild(span);\r
        storageIndex += storageValue.length;\r
      }\r
\r
      lastMatchEnd = match.index + match[0].length;\r
    }\r
\r
    // 处理最后一个匹配后的普通文本\r
    if (lastMatchEnd < subRule.length) {\r
      const text = subRule.substring(lastMatchEnd);\r
      if (text) {\r
        const textNode = document.createTextNode(text);\r
        ruleEditor.value.appendChild(textNode);\r
      }\r
    }\r
  });\r
};\r
\r
// 初始化\r
onMounted(() => {\r
  fields.value.forEach((field) => {\r
    dataValues[field.value] = "";\r
  });\r
  // // 示例数据\r
  // const rule = "asdsasad==asdsa3sadaaa;asda123包含aaaaa3";\r
  // const storageRule =\r
  //   "C53SFSYDLFRDZYSYDW4_CTBNR1FZDW_53==C421FZZZGZXZDWBM3_C42ZYCYDW_44;C732DWMC6_CTBNR1FZDW_73包含C732DWMC6_C42ZYCYDW_74";\r
\r
  // // 调用回显方法\r
  // displayRule(rule, storageRule);\r
});\r
<\/script>\r
<style scoped>\r
/* 删除按钮样式 */\r
.delete-field-btn {\r
  position: absolute;\r
  top: -8px;\r
  right: -8px;\r
  background: #ff4d4f;\r
  color: #fff;\r
  border-radius: 50%;\r
  width: 18px;\r
  height: 18px;\r
  line-height: 16px;\r
  text-align: center;\r
  font-size: 14px;\r
  font-weight: bold;\r
  cursor: pointer;\r
  z-index: 2;\r
  border: 1.5px solid #fff;\r
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);\r
  display: flex;\r
  align-items: center;\r
  justify-content: center;\r
  transition: background 0.15s;\r
}\r
.delete-field-btn:hover {\r
  background: #d9363e;\r
}\r
.field-tag-list {\r
  position: relative;\r
  /* 保证删除按钮定位 */\r
}\r
\r
/* 添加运算符标签样式 */\r
.operator-tag {\r
  display: inline-flex;\r
  align-items: center;\r
  padding: 0px 10px 0px 10px;\r
  font-weight: 500;\r
  font-size: 0.98rem;\r
  cursor: pointer;\r
  user-select: none;\r
  margin: 4px 6px 4px 0;\r
  box-shadow: 0 1px 4px rgba(108, 99, 255, 0.04);\r
  transition: background 0.2s, box-shadow 0.2s;\r
}\r
</style>\r
\r
<style scoped>\r
/* 高级渐变背景和毛玻璃效果 */\r
.rule-designer {\r
  display: flex;\r
  justify-content: center;\r
  align-items: center;\r
  font-family: "Inter", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;\r
  width: 95%;\r
  min-height: 90%;\r
  border-radius: 20px;\r
  background: linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%);\r
  padding: 40px 0;\r
  box-sizing: border-box;\r
  overflow-x: auto;\r
}\r
\r
.container {\r
  display: grid;\r
  grid-template-columns: 340px 1fr 340px;\r
  gap: 32px;\r
  max-width: 1400px;\r
  margin: 0 auto;\r
}\r
\r
.panel {\r
  border-radius: 18px;\r
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);\r
  padding: 32px 28px 28px 28px;\r
  background: rgba(255, 255, 255, 0.75);\r
  position: relative;\r
  transition: box-shadow 0.2s;\r
}\r
\r
.panel-glass {\r
  backdrop-filter: blur(12px) saturate(1.2);\r
  border: 1.5px solid rgba(120, 144, 156, 0.12);\r
}\r
\r
.panel-header {\r
  display: flex;\r
  align-items: center;\r
  font-size: 1.18rem;\r
  font-weight: 600;\r
  color: #2d3a4a;\r
  margin-bottom: 18px;\r
  letter-spacing: 0.5px;\r
  gap: 8px;\r
}\r
\r
.iconfont {\r
  font-size: 1.2em;\r
  vertical-align: middle;\r
  color: #6c63ff;\r
}\r
\r
.field-input {\r
  display: flex;\r
  gap: 10px;\r
  margin-bottom: 18px;\r
}\r
\r
.field-input input {\r
  flex: 1;\r
  padding: 10px 14px;\r
  border: none;\r
  border-radius: 8px;\r
  background: #f3f6fa;\r
  font-size: 1rem;\r
  transition: box-shadow 0.2s;\r
  box-shadow: 0 1px 2px rgba(120, 144, 156, 0.04);\r
  outline: none;\r
}\r
\r
.field-input input:focus {\r
  box-shadow: 0 0 0 2px #b2aaff;\r
}\r
\r
.add-btn {\r
  padding: 0 10px;\r
  background: linear-gradient(90deg, #6c63ff 0%, #5eead4 100%);\r
  color: #fff;\r
  border: none;\r
  border-radius: 8px;\r
  font-weight: 600;\r
  font-size: 12px;\r
  cursor: pointer;\r
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.08);\r
  transition: background 0.2s, box-shadow 0.2s;\r
  display: flex;\r
  align-items: center;\r
  gap: 6px;\r
}\r
\r
/* .add-btn:hover {\r
  background: linear-gradient(90deg, #5eead4 0%, #6c63ff 100%);\r
  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.12);\r
} */\r
\r
.field-panel {\r
  margin-bottom: 18px;\r
  min-height: 36px;\r
}\r
\r
.field-tag {\r
  display: inline-flex;\r
  align-items: center;\r
  background: linear-gradient(90deg, #e0e7ff 0%, #f3f6fa 100%);\r
  color: #6c63ff;\r
  border-radius: 6px;\r
  padding: 4px 14px 4px 10px;\r
  margin: 4px 6px 4px 0;\r
  font-weight: 500;\r
  font-size: 0.98rem;\r
  border: 1.5px solid #b2aaff;\r
  cursor: pointer;\r
  user-select: none;\r
  transition: background 0.2s, box-shadow 0.2s;\r
  box-shadow: 0 1px 4px rgba(108, 99, 255, 0.04);\r
}\r
\r
.field-tag .iconfont {\r
  font-size: 1em;\r
  margin-right: 4px;\r
  color: #5eead4;\r
}\r
\r
.field-tag.selected,\r
.editor .field-tag.selected {\r
  background: linear-gradient(90deg, #fffbe6 0%, #ffe7ba 100%);\r
  color: #d48806;\r
  border: 1.5px solid #faad14;\r
  box-shadow: 0 0 6px #faad1433;\r
}\r
\r
.editor .field-tag {\r
  display: inline-flex;\r
  align-items: center;\r
  background: linear-gradient(90deg, #e0e7ff 0%, #f3f6fa 100%);\r
  color: #6c63ff;\r
  border-radius: 6px;\r
  padding: 4px 14px 4px 10px;\r
  margin: 4px 6px 4px 0;\r
  font-weight: 500;\r
  font-size: 0.98rem;\r
  border: 1.5px solid #b2aaff;\r
  user-select: none;\r
  cursor: pointer;\r
  transition: background 0.2s, box-shadow 0.2s;\r
}\r
\r
.operator-section {\r
  margin-top: 10px;\r
}\r
\r
.operator-title {\r
  display: flex;\r
  align-items: center;\r
  font-size: 1rem;\r
  font-weight: 500;\r
  color: #5b5b5b;\r
  margin-bottom: 8px;\r
  gap: 6px;\r
}\r
\r
.operator-panel {\r
  display: flex;\r
  flex-wrap: wrap;\r
  gap: 8px;\r
}\r
\r
.operator-btn {\r
  padding: 6px 18px;\r
  background: linear-gradient(90deg, #f3f6fa 0%, #e0e7ff 100%);\r
  border: none;\r
  border-radius: 8px;\r
  cursor: pointer;\r
  color: #6c63ff;\r
  font-weight: 500;\r
  font-size: 1rem;\r
  box-shadow: 0 1px 2px rgba(120, 144, 156, 0.04);\r
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;\r
}\r
\r
.operator-btn:hover {\r
  background: linear-gradient(90deg, #6c63ff 0%, #5eead4 100%);\r
  color: #fff;\r
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.1);\r
}\r
\r
.editor {\r
  width: 600px;\r
  min-height: 320px;\r
  border: 2.5px solid #b2aaff;\r
  border-radius: 12px;\r
  padding: 18px 16px;\r
  margin: 18px 0 0 0;\r
  background: rgba(255, 255, 255, 0.7);\r
  font-size: 1.08rem;\r
  font-family: "JetBrains Mono", "Fira Mono", "Menlo", "Consolas", monospace;\r
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.04);\r
  transition: border 0.2s, box-shadow 0.2s;\r
  outline: none;\r
}\r
\r
.editor:focus {\r
  border: 2.5px solid #6c63ff;\r
  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.1);\r
}\r
\r
.data-inputs {\r
  margin-bottom: 18px;\r
}\r
\r
.data-input {\r
  display: flex;\r
  align-items: center;\r
  gap: 10px;\r
  margin: 10px 0;\r
}\r
\r
.data-input label {\r
  flex: 0 0 80px;\r
  color: #6c63ff;\r
  font-weight: 500;\r
  display: flex;\r
  align-items: center;\r
  gap: 4px;\r
}\r
\r
.data-input input {\r
  flex: 1;\r
  padding: 8px 12px;\r
  border: none;\r
  border-radius: 8px;\r
  background: #f3f6fa;\r
  font-size: 1rem;\r
  transition: box-shadow 0.2s;\r
  box-shadow: 0 1px 2px rgba(120, 144, 156, 0.04);\r
  outline: none;\r
}\r
\r
.data-input input:focus {\r
  box-shadow: 0 0 0 2px #b2aaff;\r
}\r
\r
.validate-btn {\r
  margin: 18px 0 0 0;\r
  padding: 10px 24px;\r
  background: linear-gradient(90deg, #6c63ff 0%, #5eead4 100%);\r
  color: #fff;\r
  border: none;\r
  border-radius: 8px;\r
  font-weight: 600;\r
  font-size: 1.08rem;\r
  cursor: pointer;\r
  box-shadow: 0 2px 8px rgba(108, 99, 255, 0.08);\r
  transition: background 0.2s, box-shadow 0.2s;\r
  display: flex;\r
  align-items: center;\r
  gap: 8px;\r
}\r
\r
.validate-btn:hover {\r
  background: linear-gradient(90deg, #5eead4 0%, #6c63ff 100%);\r
  box-shadow: 0 4px 16px rgba(108, 99, 255, 0.12);\r
}\r
\r
.result {\r
  margin-top: 18px;\r
  padding: 18px 16px;\r
  background: rgba(236, 253, 245, 0.85);\r
  border-radius: 10px;\r
  box-shadow: 0 1px 4px rgba(34, 197, 94, 0.06);\r
  border: 1.5px solid #5eead4;\r
  animation: fadeIn 0.4s;\r
}\r
\r
.result-message {\r
  display: flex;\r
  align-items: center;\r
  font-size: 1.08rem;\r
  font-weight: 600;\r
  margin-bottom: 8px;\r
  gap: 8px;\r
}\r
\r
.result-message.success {\r
  color: #22c55e;\r
}\r
\r
.result-message.error {\r
  color: #ef4444;\r
}\r
\r
.result-message .iconfont {\r
  font-size: 1.3em;\r
}\r
\r
.result-details {\r
  margin-top: 8px;\r
  font-size: 0.98rem;\r
  color: #374151;\r
}\r
\r
.result-details code {\r
  background: #f3f6fa;\r
  border-radius: 4px;\r
  padding: 2px 6px;\r
  font-family: "JetBrains Mono", "Fira Mono", "Menlo", "Consolas", monospace;\r
  color: #6c63ff;\r
}\r
\r
.fade-enter-active,\r
.fade-leave-active {\r
  transition: opacity 0.3s;\r
}\r
.fade-enter-from,\r
.fade-leave-to {\r
  opacity: 0;\r
}\r
\r
@keyframes fadeIn {\r
  from {\r
    opacity: 0;\r
    transform: translateY(16px);\r
  }\r
  to {\r
    opacity: 1;\r
    transform: none;\r
  }\r
}\r
</style>\r
`;export{n as default};
