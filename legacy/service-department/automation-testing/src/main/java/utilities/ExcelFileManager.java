package utilities;

import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class ExcelFileManager {
    private FileInputStream fileInput;
    private FileOutputStream fileOutput;
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    private XSSFRow row;
    private XSSFCell cell;
    private CellStyle style;
    private String path;

    public ExcelFileManager(String path){
        this.path = path;
    }

    // Get the Rows count in a sheet.
    public int getRowCount(String sheetName) throws IOException {
        fileInput = new FileInputStream(path);
        workbook = new XSSFWorkbook(fileInput);
        sheet = workbook.getSheet(sheetName);
        int rowCount = sheet.getLastRowNum();
        workbook.close();
        fileInput.close();
        return rowCount;
    }

    // Get the Cells count in a row of a sheet.
    public int getCellCount(String sheetName, int rowNum) throws IOException {
        fileInput = new FileInputStream(path);
        workbook = new XSSFWorkbook(fileInput);
        sheet = workbook.getSheet(sheetName);
        row = sheet.getRow(rowNum);
        int cellCount = row.getLastCellNum();
        workbook.close();
        fileInput.close();
        return cellCount;
    }

    // Get the data in a Cell.
    public String getCellData(String sheetName, int rowNum, int column) throws IOException {
        fileInput = new FileInputStream(path);
        workbook = new XSSFWorkbook(fileInput);
        sheet = workbook.getSheet(sheetName);
        row = sheet.getRow(rowNum);
        cell = row.getCell(column);

        DataFormatter formatter = new DataFormatter();
        String data;
        try{
            //Returns the formatted value of a cell
            data = formatter.formatCellValue(cell);
        } catch (Exception e) {data = "";}
        workbook.close();
        fileInput.close();
        return data;
    }

    // Write the data in a Cell.
    public void setCellData(String sheetName, int rowNum, int column, String data) throws IOException {
        File xlFile= new File(path);
        if(!xlFile.exists())
        {//if the file doesn't exist, then create a new file.
            workbook=new XSSFWorkbook();
            fileOutput=new FileOutputStream(path);
            workbook.write(fileOutput);
        }
        fileInput=new FileInputStream(path);
        workbook=new XSSFWorkbook(fileInput);

        if(workbook.getSheetIndex(sheetName)==-1)
        {//if the sheet doesn't exist, then create a new sheet.
            workbook.createSheet(sheetName);
        }
        sheet=workbook.getSheet(sheetName);

        if(sheet.getRow(rowNum)==null)
        { // if the row doesn't exist, then create a new row.
            sheet.createRow(rowNum);
        }
        row=sheet.getRow(rowNum);
        cell = row.createCell(column);
        cell.setCellValue(data);
        fileOutput = new FileOutputStream(path);
        workbook.write(fileOutput);
        workbook.close();
        fileInput.close();
    }
}
