import Event from './Event';
import Category from './Category';
import EventParticipant from './EventParticipant';

// Define Relationships
Category.hasMany(Event, {
  sourceKey: 'id',
  foreignKey: 'categoryId',
  as: 'events',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

Event.belongsTo(Category, {
  targetKey: 'id',
  foreignKey: 'categoryId',
  as: 'category',
});

Event.hasMany(EventParticipant, {
  sourceKey: 'id',
  foreignKey: 'eventId',
  as: 'participants',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

EventParticipant.belongsTo(Event, {
  targetKey: 'id',
  foreignKey: 'eventId',
  as: 'event',
});

export {
  Event,
  Category,
  EventParticipant,
}; 