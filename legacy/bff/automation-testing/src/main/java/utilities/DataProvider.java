package utilities;

import java.io.IOException;

public class DataProvider {
    @org.testng.annotations.DataProvider(name = "Data")
    public Object[][] getAllData(String path) throws IOException {
        path = System.getProperty("user.dir")+ path;
        ExcelFileManager xl = new ExcelFileManager(path);

        int rowNum = xl.getRowCount("Sheet1");
        int colCount = xl.getCellCount("Sheet1", 1);

        String[][] apiData = new String[rowNum][colCount];
        for (int i=1; i<= rowNum; i++){
            for (int j=0; j< colCount; j++){
                apiData[i-1][j] = xl.getCellData("Sheet1",i,j);
            }
        }
        return apiData;
    }


    }