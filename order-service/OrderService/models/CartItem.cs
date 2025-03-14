using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OrderService.Models
{
    public class CartItem
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid CartId { get; set; }

        [Required]
        public Guid ProductId { get; set; }

        [Required]
        public int Quantity{get; set;}
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("CartId")]
        public virtual Cart Cart {get; set;}
    }
}