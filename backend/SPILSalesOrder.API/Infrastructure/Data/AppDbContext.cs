using Microsoft.EntityFrameworkCore;
using SPILSalesOrder.API.Domain.Entities;

namespace SPILSalesOrder.API.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
    public DbSet<SalesOrderItem> SalesOrderItems => Set<SalesOrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Client>().HasData(
            new Client
            {
                Id = 1,
                CustomerName = "ABC Traders",
                Address1 = "No 10",
                Address2 = "Main Street",
                Address3 = "Colombo",
                Suburb = "Colombo 03",
                State = "Western",
                PostCode = "00300"
            },
            new Client
            {
                Id = 2,
                CustomerName = "Green Mart",
                Address1 = "No 22",
                Address2 = "Lake Road",
                Address3 = "Kandy",
                Suburb = "Kandy",
                State = "Central",
                PostCode = "20000"
            },
            new Client
            {
                Id = 3,
                CustomerName = "Tech World",
                Address1 = "No 45",
                Address2 = "Galle Road",
                Address3 = "Gampaha",
                Suburb = "Gampaha",
                State = "Western",
                PostCode = "11000"
            }
        );

        modelBuilder.Entity<Item>().HasData(
            new Item { Id = 1, ItemCode = "ITM001", Description = "Laptop", Price = 250000 },
            new Item { Id = 2, ItemCode = "ITM002", Description = "Mouse", Price = 2500 },
            new Item { Id = 3, ItemCode = "ITM003", Description = "Keyboard", Price = 6500 },
            new Item { Id = 4, ItemCode = "ITM004", Description = "Monitor", Price = 45000 },
            new Item { Id = 5, ItemCode = "ITM005", Description = "Printer", Price = 75000 }
        );
    }
}