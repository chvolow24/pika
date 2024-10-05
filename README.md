# Pika

### A tiny client-side templating tool


Pika is a single Javascript file that can be used to flesh out an HTML template with data.


## Setting the data

In your HTML `<body>` element, set the `templateVar` attribute to the name of a global javascript object variable that you want to use to fill out your template. 

(If you do not set `templateVar`, the global scope (`window`) will be used for template parameters instead.)

E.g.:

```
<body templateVar="some_data">
```


## Template parameters

Now, you are free to access members of the `templateVar` (in this case, `some_data`) in your HTML, using double curly braces (w/ spaces):


JS:
```
var some_data = {
  "author": {
    "first_name": "Charlie",
    "last_name": "Volow"
  }
}
```
HTML:
```
<h3>by {{ author.name }} {{author.last_name }}</h3>
```

## For loops

For loops are also supported by setting the `class` and `iterable` properties on arbitrary elements. `iterable` should be the name of a javascript array.

```
<ul>
  <div class="for-loop" iterable="audio_files">
    <a href="{{ href }}">{{ track_title }}</a>
  </div>
</ul>
```

Here, `href` and `track_title` must both be acessible on each member of `audio_files`, which is an array. 

If the `for-loop` element is `<tr>` or `<li>`, the outer HTML will be replicated with each iteration; otherwise, the inner HTML will be replicated.

## Nested for loops

Nested for loops are also supported. 

HTML:
```
<ul>
  <li class="for-loop" iterable="audio_files">
    <a href="{{ href }}">{{ title }}</a>
    <ul>
      <li class="for-loop" iterable="stats">
	    {{ name }} : {{ value }}
      </li>
    </ul>
  </li>
</ul>
```

Here we'd expect the data to look something like this:

JS:
```
var template_data = {"audio_files": [
  {
    "title": "my_beat",
    "href": "my_beat.wav",
	"stats": [
	  {"name" : "length_seconds", "value" : 253},
	  {"name" : "sample_rate", "value": "44.1kHZ"}
    ]
  },
  {
	"title": "tune",
	"href": "tune.wav",
	"stats": [
	  {"name" : "length_seconds", "value" : 133},
	  {"name" : "sample_rate", "value": "48.0kHZ"}
    ]
  }
]};
```

Note that a `<li>` element is being used for the for loop here. `<tr>` elements can also be used. 

## Final step
Now all you need to do is add `pika.js` to your file and call `pika()` at load time to complete the template:

```
<script src="pika.js"></script>
<script>
	window.onload = pika;
</script>
```


## Examples

check out `EXAMPLE_presidents.html` and `EXAMPLE_trees.html`, which need only exist in the same directory as a copy of `pika.js` to be filled. 
