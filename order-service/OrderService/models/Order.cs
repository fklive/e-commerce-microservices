using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OrderService.Models
{

    public enum OrderStatus
    {
        Pending,
        Confirmed,
        Shipped,
        Delivered,
        Cancelled
    }

    public class Order
    {

        public Order(){
            OrderItems = new List<OrderItem>();
        }

        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public string ShippingAddress { get; set; }

        [Required]
        public string BillingAddress { get; set; }


        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // İlişkiler
        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }
}