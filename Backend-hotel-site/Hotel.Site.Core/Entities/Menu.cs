using System;
using System.Collections.Generic;
using System.Text;
using Hotel.Site.Core.Entities.Enums;
using DayOfWeek = Hotel.Site.Core.Entities.Enums.DayOfWeek;

namespace Hotel.Site.Core.Entities
{
    public class Menu
    {
        public Guid IdMenu { get; set; }
        public DayOfWeek GiornoSettimana { get; set; }
        public virtual ICollection<Dish> Piatti { get; set; } = new HashSet<Dish>();
        //public virtual ICollection<Dish> Secondi { get; set; } = new HashSet<Dish>(); ridondante, abbiamo già dishType in piatti
        //poi chiameremo in var primi   = menu.Piatti.Where(d => d.TipoPiatto == DishType.PRIMO);
    }
}
