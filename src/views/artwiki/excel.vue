<template>
  <div class="excel">
    <html-preview></html-preview>
  </div>
</template>

<script>
var SheetJSFT = [
	"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function(x) { return "." + x; }).join(",");

var SJSTemplate = [
	'<div>',
		'<input type="file" multiple="false" id="sheetjs-input" accept="' + SheetJSFT + '" @change="onchange" />',
		'<br/>',
		'<button type="button" id="export-table" style="visibility:hidden" @click="onexport">Export to XLSX</button>',
		'<br/>',
		'<div id="out-table"></div>',
	'</div>'
].join("");

export default {
  data() {
    return {}
  },
  components: {
    'html-preview': {
      template: SJSTemplate,
    }
  }
}
</script>

<style>

</style>
