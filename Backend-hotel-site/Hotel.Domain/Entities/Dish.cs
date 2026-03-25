using Hotel.Domain.Enums;

namespace Hotel.Domain.Entities
{
    public class Dish
    {
        public Guid IdDish { get; set; }
        public String Nome { get; set; } = string.Empty;
        public String Descrizione { get; set; } = string.Empty;
        public DishCategory Categoria { get; set; }
        public DishType TipoPiatto { get; set; }

        public Guid MenuId { get; set; }
        public Menu Menu { get; set; } = null!;
    }
}
