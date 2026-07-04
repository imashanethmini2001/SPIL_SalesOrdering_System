namespace SPILSalesOrder.API.Models.DTOs;

public class SalesOrderDto
{
    public int Id { get; set; }

    public int ClientId { get; set; }
    public string CustomerName { get; set; } = string.Empty;

    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public string ReferenceNo { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;

    public string Address1 { get; set; } = string.Empty;
    public string Address2 { get; set; } = string.Empty;
    public string Address3 { get; set; } = string.Empty;
    public string Suburb { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string PostCode { get; set; } = string.Empty;

    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }

    public List<SalesOrderItemDto> Items { get; set; } = new();
}