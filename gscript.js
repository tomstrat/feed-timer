function doPost(request) {
  const params = JSON.parse(request.postData.contents);
  if (params !== undefined) { 
    parseData(params.data);
    return ContentService.createTextOutput(`${params.data.volume}, ${params.data.duration}`);
  }
  else {
    return ContentService.createTextOutput("Oops " + JSON.stringify(request)).setMimeType(ContentService.MimeType.TEXT);
  }  
}

function parseData(data) {
  //Check for baby output
  if(data.wee || data.poo) {
    addOutputRow(data);
  }
  //Check for feeding
  if(data.duration > 0 || data.volume > 0) {
    addFeedRow(data);
  }
}

function addFeedRow(data){
  const emptyRow = getFirstEmptyRowByColumnArray("Feeds");
  const spr = SpreadsheetApp.openById('1lWk-99O3V1OxW-H4HYNZjZO7sxPPF33BGUYSEqekk3I').getSheetByName('Feeds');
  spr.getRange(emptyRow, 1).setValue(data.date);
  spr.getRange(emptyRow, 2).setValue(data.time);
  spr.getRange(emptyRow, 3).setValue(data.duration);
  spr.getRange(emptyRow, 4).setValue(data.volume);
  spr.getRange(emptyRow, 5).setValue(`=((C${emptyRow}/5) * 10) + D${emptyRow}`);
}

function addOutputRow(data){
  const emptyRow = getFirstEmptyRowByColumnArray("Nappies");
  const spr = SpreadsheetApp.openById('1lWk-99O3V1OxW-H4HYNZjZO7sxPPF33BGUYSEqekk3I').getSheetByName('Nappies');
  let outputType = "";
  if(data.wee && data.poo){
    outputType = "Wee/Poo";
  } else if(data.wee){
    outputType = "Wee";
  } else {
    outputType = "Poo";
  }
  spr.getRange(emptyRow, 1).setValue(data.date);
  spr.getRange(emptyRow, 2).setValue(data.time);
  spr.getRange(emptyRow, 3).setValue(outputType);
}

function getFirstEmptyRowByColumnArray(sheetName) {
  const spr = SpreadsheetApp.openById('1lWk-99O3V1OxW-H4HYNZjZO7sxPPF33BGUYSEqekk3I').getSheetByName(sheetName);
  const column = spr.getRange('A:A');
  const values = column.getValues(); // get all data in one call
  let ct = 0;
  while ( values[ct] && values[ct][0] != "" ) {
    ct++;
  }
  return (ct+1);
}