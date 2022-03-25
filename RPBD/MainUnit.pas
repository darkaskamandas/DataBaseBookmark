unit MainUnit;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Data.DB, Vcl.ExtCtrls, Vcl.DBCtrls,
  Vcl.StdCtrls, Datasnap.DBClient, Vcl.ComCtrls, Vcl.Grids, Vcl.DBGrids;

type
  TMainForm = class(TForm)
    LabelCalc: TLabel;
    DBGrid1: TDBGrid;
    StatusBar: TStatusBar;
    DataSource: TDataSource;
    TableProducts: TClientDataSet;
    TableProductsProductID: TIntegerField;
    TableProductsProductName: TStringField;
    TableProductsSupplierID: TIntegerField;
    TableProductsCategoryID: TIntegerField;
    TableProductsQuantityPerUnit: TStringField;
    TableProductsUnitPrice: TBCDField;
    TableProductsUnitsInStock: TSmallintField;
    TableProductsUnitsOnOrder: TSmallintField;
    TableProductsReorderLevel: TSmallintField;
    TableProductsDiscontinued: TBooleanField;
    ButtonMin: TButton;
    ButtonMax: TButton;
    ButtonCAP: TButton;
    ButtonMoreInfo: TButton;
    DBNavigator1: TDBNavigator;
    procedure ButtonMinClick(Sender: TObject);
    procedure ButtonMaxClick(Sender: TObject);
    procedure ButtonCAPClick(Sender: TObject);
    procedure ButtonMoreInfoClick(Sender: TObject);
    procedure TableProductsAfterScroll(DataSet: TDataSet);
    procedure TableProductsAfterOpen(DataSet: TDataSet);
    procedure FormDestroy(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  MainForm: TMainForm;

implementation

{$R *.dfm}

procedure TMainForm.ButtonCAPClick(Sender: TObject);
var
AvgPriceBookmark: TBookmark;
AvgPrice: Double;
  begin
    AvgPrice := 0.0;
    AvgPriceBookmark := TableProducts.GetBookmark;
    TableProducts.DisableControls;
    try
      begin
        TableProducts.First;
        while not TableProducts.Eof do
        begin
          AvgPrice := AvgPrice + TableProductsUnitPrice.AsFloat;
          TableProducts.Next;
        end;
      end;
    finally
    begin
      TableProducts.GotoBookmark(AvgPriceBookmark);
      TableProducts.FreeBookmark(AvgPriceBookmark);
      TableProducts.EnableControls;
    end;
  end;

  if (TableProducts.RecordCount > 0) then
  begin
    AvgPrice := AvgPrice / TableProducts.RecordCount;
  end
  else
  begin
    AvgPrice := 0.0;
  end;

  LabelCalc.Caption := FloatToStrF(AvgPrice, ffCurrency, 15, 2);
end;

procedure TMainForm.ButtonMaxClick(Sender: TObject);
var
MaxPriceBookmark: TBookmark;
MaxPrice: Double;

begin
  if (TableProducts.BookmarkValid(MaxPriceBookmark)) then
  begin
    TableProducts.GotoBookmark(MaxPriceBookmark);
  end
  else
  begin
    MaxPrice := 0.0;
    TableProducts.DisableControls;
    try
      begin
        TableProducts.First;
        while not TableProducts.Eof do
        begin
          if (TableProductsUnitPrice.AsFloat > MaxPrice) then
          begin
            MaxPrice := TableProductsUnitPrice.AsFloat;
            MaxPriceBookmark := TableProducts.GetBookmark;
          end;
          TableProducts.Next;
        end;
      end;
    finally
    begin
      TableProducts.GotoBookmark(MaxPriceBookmark);
      TableProducts.EnableControls;
    end;

    end;
  end;

  LabelCalc.Caption := FloatToStrF(TableProductsUnitPrice.AsFloat, ffCurrency, 15, 2);
end;

procedure TMainForm.ButtonMinClick(Sender: TObject);
var
MinPriceBookmark: TBookmark;
MinPrice: Double;

begin
  if (TableProducts.BookmarkValid(MinPriceBookmark)) then
  begin
    TableProducts.GotoBookmark(MinPriceBookmark);
  end
  else
  begin
    MinPrice := MaxInt * 1.0;
    TableProducts.DisableControls;
    try
      begin
        TableProducts.First;
        while not TableProducts.Eof do
        begin
          if (TableProductsUnitPrice.AsFloat < MinPrice) then
          begin
            MinPrice := TableProductsUnitPrice.AsFloat;
            MinPriceBookmark := TableProducts.GetBookmark;
          end;
          TableProducts.Next;
        end;
      end;
    finally
    begin
      TableProducts.GotoBookmark(MinPriceBookmark);
      TableProducts.EnableControls;
    end;

    end;
  end;

  LabelCalc.Caption := FloatToStrF(TableProductsUnitPrice.AsFloat, ffCurrency, 15, 2);

end;

procedure TMainForm.ButtonMoreInfoClick(Sender: TObject);
begin
   ShowMessage('Product Information' + #13 + '---------------------------------' + #13 +
  'ProductID: ' + TableProductsProductID.AsString + #13 +
  'ProductName: ' + TableProductsProductName.AsString + #13 +
  'SupplierID: ' + TableProductsSupplierID.AsString + #13 +
  'CategoryID: ' + TableProductsCategoryID.AsString + #13 +
  'QuantityPerUnit: ' + TableProductsQuantityPerUnit.AsString + #13 +
  'UnitPrice: ' + FloatToStrF(TableProductsUnitPrice.AsFloat, ffCurrency, 15, 2) + #13 +
  'UnitsInStock: ' + TableProductsUnitsInStock.AsString + #13 +
  'UnitsOnOrder: ' + TableProductsUnitsOnOrder.AsString + #13 +
  'ReorderLevel: ' + TableProductsReorderLevel.AsString + #13 +
  'Discontinued: ' + TableProductsDiscontinued.AsString);
end;

procedure TMainForm.FormCreate(Sender: TObject);
begin
  if TableProducts.Active then TableProducts.Close;
  TableProducts.FileName := ExtractFilePath(Application.ExeName) + 'Products.xml';
  if TableProducts.Active = False then TableProducts.Open;
end;

procedure TMainForm.FormDestroy(Sender: TObject);
begin
  if TableProducts.Active = True then TableProducts.Close;
  
end;

procedure TMainForm.TableProductsAfterOpen(DataSet: TDataSet);
begin
  StatusBar.Panels.Items[0].Text := 'Record count: ' + IntToStr(TableProducts.RecordCount);
end;

procedure TMainForm.TableProductsAfterScroll(DataSet: TDataSet);
begin
  StatusBar.Panels.Items[1].Text :=
  (' Product: ' + TableProductsProductName.AsString + ' , ' +
  TableProductsQuantityPerUnit.AsString + ' - ' +
  FloatToStrF(TableProductsUnitPrice.AsFloat, ffCurrency, 15, 2));
end;

end.
