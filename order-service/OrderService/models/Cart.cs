using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OrderService.Models
{
    public class Cart
    {
        [Key]
        public Guid Id { get; set; }

        public Guid? UserId { get; set; }

        [Required]
        public string SessionId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public virtual required ICollection<CartItem> CartItems { get; set; }
        
    }
}