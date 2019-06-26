// There is some trickery with trickery with buttons instead of regular text,
// since even though vue.js is completely fine making ordinary text-containing
// table elements tabbable and clickable, this is NOT considered accessible
// by the WCAG 2.1 standard. Hence, the content must be made accessible with
// sequential keyboard usage and must be made to work with the screen readers
// and other accessibility software available on the market, which in turn
// requires using the correct html tags for _all_ interactive content on the
// webpage. The only practical annoyance with this is the unnecessary
// abundance of css that needs to be written as result. (for making the design
// language consistent with what a regular user considers to be a table)
// For a better explanation head to the address:
// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex#Accessibility_concerns

// A vue.js component for the bucket table headings. The only column currently
// is the bucket/container name, so not much needs to be displayed
Vue.component('bucket-table-heading', {
    template: '<tr>\
                <th>Bucket</th>\
              </tr>'
});

// A vue.js component for the bucket table rows. The bucket/container name will
// emit a bclick event when clicked, and thus will lead to the clicked bucket
// being opened
Vue.component('bucket-table-row', {
    props: ['bname', 'bdate',],
    template: '<tr>\
                <button id="bucketname" v-on:click="$emit(\'bclick\')">{{ bname }}</button>\
               </tr>'
});

// A vue.js component for the object table headings. The columns are the Back
// -column (used to provide a visible back button), Bucket-column (used to
// display the bucket the objects belong to), Name-column (used to display
// the name of the objetc on the row), Last modified -column (used to
// display the date the object was last modified), Size-column (used to display
// the size of the object) and the Download-column, containing download links
// for each object (though the link will be only actually generated upon action
// on the server side)
Vue.component('object-table-heading', {
    template: '<tr>\
    <button id="backbutton" v-on:click="$emit(\'oheadingclick\')">Back</button>\
    <th>Bucket</th>\
    <th>Name</th>\
    <th>Last modified</th>\
    <th>Size</th>\
    <th>Download</th>\
    </tr>'
});

// A vue.js component for the object table rows. The columns are as specified
// before. The column with the ID backcolumn will emit an 'oheadingclick' event
// upon clicking, so the spa knows to go back to displaying buckets.
Vue.component('object-table-row', {
    props: ['stobject', 'bucket', 'dloadlink'],
    template: '\
    <tr>\
    <td id="backcolumn" v-on:click="$emit(\'oheadingclick\')"><-</td>\
    <td>{{ bucket }}</td>\
    <td>{{ stobject.name }}</td>\
    <td>{{ stobject.last_modified }}</td>\
    <td>{{ stobject.bytes }}</td>\
    <td id="tableaddrrow"><a id="tableaddr" :href="dloadlink">Link</a></td>\
    </tr>'
});

// A vue.js component for listing all the projects which are available for the
// user that's currently logged in
Vue.component('project-list-element', {
    props: ['project'],
    template: '\
    <li class="projectlistelement">\
    <button class="projectbutton" v-on:click="$emit(\'projectclick\')">{{ project }}</button>\
    </li>'
});
