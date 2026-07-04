using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SPILSalesOrder.API.Domain.Entities;
using SPILSalesOrder.API.Infrastructure.Data;

namespace SPILSalesOrder.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesOrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public SalesOrdersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSalesOrders()
    {
        var orders = await _context.SalesOrders
            .Include(o => o.Client)
            .Select(o => new
            {
                o.Id,
                o.InvoiceNo,
                o.InvoiceDate,
                CustomerName = o.Client!.CustomerName,
                o.ReferenceNo,
                o.TotalExcl,
                o.TotalTax,
                o.TotalIncl
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id}")]
public async Task<IActionResult> GetSalesOrder(int id)
{
    var order = await _context.SalesOrders
        .Include(o => o.Client)
        .Include(o => o.Items)
        .ThenInclude(i => i.Item)
        .FirstOrDefaultAsync(o => o.Id == id);

    if (order == null)
    {
        return NotFound();
    }

    return Ok(new
    {
        order.Id,
        order.ClientId,
        CustomerName = order.Client!.CustomerName,
        order.InvoiceNo,
        order.InvoiceDate,
        order.ReferenceNo,
        order.Note,
        order.Address1,
        order.Address2,
        order.Address3,
        order.Suburb,
        order.State,
        order.PostCode,
        order.TotalExcl,
        order.TotalTax,
        order.TotalIncl,
        Items = order.Items.Select(i => new
        {
            i.Id,
            i.ItemId,
            ItemCode = i.Item!.ItemCode,
            Description = i.Item.Description,
            i.Note,
            i.Quantity,
            i.Price,
            i.TaxRate,
            i.ExclAmount,
            i.TaxAmount,
            i.InclAmount
        })
    });
}
    [HttpPost]
    public async Task<IActionResult> CreateSalesOrder(SalesOrder order)
    {
        foreach (var item in order.Items)
        {
            item.ExclAmount = item.Quantity * item.Price;
            item.TaxAmount = item.ExclAmount * item.TaxRate / 100;
            item.InclAmount = item.ExclAmount + item.TaxAmount;
        }

        order.TotalExcl = order.Items.Sum(i => i.ExclAmount);
        order.TotalTax = order.Items.Sum(i => i.TaxAmount);
        order.TotalIncl = order.Items.Sum(i => i.InclAmount);

        _context.SalesOrders.Add(order);
        await _context.SaveChangesAsync();

       return Ok(new
{
    order.Id,
    order.InvoiceNo,
    order.TotalExcl,
    order.TotalTax,
    order.TotalIncl,
    Message = "Sales order saved successfully"
});
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSalesOrder(int id, SalesOrder updatedOrder)
    {
        var existingOrder = await _context.SalesOrders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (existingOrder == null)
        {
            return NotFound();
        }

        existingOrder.ClientId = updatedOrder.ClientId;
        existingOrder.InvoiceNo = updatedOrder.InvoiceNo;
        existingOrder.InvoiceDate = updatedOrder.InvoiceDate;
        existingOrder.ReferenceNo = updatedOrder.ReferenceNo;
        existingOrder.Note = updatedOrder.Note;

        existingOrder.Address1 = updatedOrder.Address1;
        existingOrder.Address2 = updatedOrder.Address2;
        existingOrder.Address3 = updatedOrder.Address3;
        existingOrder.Suburb = updatedOrder.Suburb;
        existingOrder.State = updatedOrder.State;
        existingOrder.PostCode = updatedOrder.PostCode;

        _context.SalesOrderItems.RemoveRange(existingOrder.Items);

        foreach (var item in updatedOrder.Items)
        {
            item.ExclAmount = item.Quantity * item.Price;
            item.TaxAmount = item.ExclAmount * item.TaxRate / 100;
            item.InclAmount = item.ExclAmount + item.TaxAmount;
        }

        existingOrder.Items = updatedOrder.Items;

        existingOrder.TotalExcl = updatedOrder.Items.Sum(i => i.ExclAmount);
        existingOrder.TotalTax = updatedOrder.Items.Sum(i => i.TaxAmount);
        existingOrder.TotalIncl = updatedOrder.Items.Sum(i => i.InclAmount);

        await _context.SaveChangesAsync();

        return Ok(new
{
    existingOrder.Id,
    existingOrder.InvoiceNo,
    existingOrder.TotalExcl,
    existingOrder.TotalTax,
    existingOrder.TotalIncl,
    Message = "Sales order updated successfully"
});
    }
}