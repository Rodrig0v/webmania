'use strict';

export default {
  // get star rate of given notes
  getStarRating(notes, keys, time_scale) {
    // constants
    const strain_step = 400 * time_scale, weight_decay_base = 0.9, individual_decay_base = 0.125, overall_decay_base = 0.3, star_scaling_factor = 0.018;

    // get strain for each note
    var held_until = new Array(keys).fill(0);
    var previous_note = null;
    notes.forEach((note) => {
        note.individual_strain = new Array(keys).fill(0)
        note.overall_strain = 1

        if(!previous_note) {
            previous_note = note;
            return;
        }

        const time_elapsed = (note.startTime - previous_note.startTime) / time_scale / 1000;
        const individual_decay = individual_decay_base ** time_elapsed;
        const overall_decay = overall_decay_base ** time_elapsed;
        var hold_factor = 1, hold_addition = 0;

        for(var i = 0; i < keys; i++) {
            if(note.startTime < held_until[i] && note.endTime > held_until[i]) {
                hold_addition = 1;
            } else if(note.endTime == held_until[i]) {
                hold_addition = 0;
            } else if(note.endTime < held_until[i]) {
                hold_factor = 1.25;
            }
            note.individual_strain[i] = previous_note.individual_strain[i] * individual_decay;
        }
        held_until[note.key] = note.endTime;

        note.individual_strain[note.key] += 2 * hold_factor;
        note.overall_strain = previous_note.overall_strain * overall_decay + (1 + hold_addition) * hold_factor;

        previous_note = note;
    });

    // get difficulty for each interval
    var strain_table = [], max_strain = 0, interval_endTimeime = strain_step;
    previous_note = null;
    notes.forEach((note) => {
        while(note.startTime > interval_endTimeime) {
            strain_table.push(max_strain);
            if(!previous_note) {
                max_strain = 0;
            } else {
                const individual_decay = individual_decay_base ** ((interval_endTimeime - previous_note.startTime) / 1000);
                const overall_decay = overall_decay_base ** ((interval_endTimeime - previous_note.startTime) / 1000);
                max_strain = previous_note.individual_strain[previous_note.key] * individual_decay + previous_note.overall_strain * overall_decay;
            }
            interval_endTimeime += strain_step;
        }
        const strain = note.individual_strain[note.key] + note.overall_strain;
        if(strain > max_strain) max_strain = strain;
        previous_note = note;
    });

    // get total difficulty
    var difficulty = 0, weight = 1;
    strain_table.sort((x, y) => {return y - x});
    for(var i = 0; i < strain_table.length; i++) {
        difficulty += strain_table[i] * weight;
        weight *= weight_decay_base;
    }
    return difficulty * star_scaling_factor;
  }
}