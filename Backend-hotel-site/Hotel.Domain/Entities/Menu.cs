using Backend_hotel_site.Hotel.Domain.Entities.Enums;

namespace Backend_hotel_site.Hotel.Domain.Entities
{
    public class Menu
    {
        public Guid IdMenu { get; set; }

        public GiornoSettimana GiornoSettimana { get; set; }
        public virtual ICollection<Dish> Piatti { get; set; } = new HashSet<Dish>();
        //public virtual ICollection<Dish> Secondi { get; set; } = new HashSet<Dish>(); ridondante, abbiamo già dishType in piatti
        //poi chiameremo in var primi   = menu.Piatti.Where(d => d.TipoPiatto == DishType.PRIMO);
    }
}
