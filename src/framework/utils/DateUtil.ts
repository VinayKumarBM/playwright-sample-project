import moment from 'moment';

export default class DateUtil {
   /**
    * Generates date based on the input
    * @param format date format
    * @param days increment OR decrement the days
    * @param months increment OR decrement the months
    * @param years increment OR decrement the years
    * @returns 
    */
   public static dateGenerator(format: string, days: number, months: number, years: number): string {
      const date = moment().add(days, 'd').add(months, 'M').add(years, 'y')
.format(format);   
      return date;
   }

   /**
    * Customizes the date that has been given as input based on other input parameter
    * @param date to be customized
    * @param format date format
    * @param days increment OR decrement the days
    * @param months increment OR decrement the months
    * @param years increment OR decrement the years
    * @returns 
    */
   public static dateCustomizer(date: string, format: string, days: number, months: number, years: number): string {
      const customDate = moment(date, format).add(days, 'd').add(months, 'M').add(years, 'y')
.format(format);
      return customDate;
   }

   /**
    * Generates time in hr:min format based on the input
    * @param format time format
    * @param hours increment OR decrement the hours
    * @param minutes increment OR decrement the minutes
    * @returns 
    */
   public static timeGenerator(format: string, hours: number, minutes: number): string {
      const time = moment().add(minutes, 'm').add(hours, 'h').format(format);
      return time;
   }
}
