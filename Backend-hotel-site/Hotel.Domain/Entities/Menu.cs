namespace Backend_hotel_site.Hotel.Domain.Entities
{
    public class Menu
    {
        public Guid IdMenu { get; set; }

        public DayOfWeek GiornoSettimana { get; set; }
        public virtual ICollection<Dish> Primi { get; set; } = new HashSet<Dish>();
        public virtual ICollection<Dish> Secondi { get; set; } = new HashSet<Dish>();
    }
}
