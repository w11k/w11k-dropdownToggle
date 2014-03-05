# w11k-dropdownToggle - Advanced AngularJS Directive for Bootstrap Dropdowns

w11k-dropdownToggle is an AngularJS directive which offers advanced control of Bootstrap dropdowns.

Features:

* Toggle dropdown by click
* Automatically close open dropdown on opening another
* Programatically open and close dropdown from controller
* Prevent closing dropdown via event listener (e.g. containing invalid form)
 

## Getting Started

### Installation

* Install via Bower (w11k-dropdownToggle) or download manually from our release repository (https://github.com/w11k/w11k-dropdownToggle-bower)
* Include script into your application
* Add dependency to w11k-dropdownToggle module

### Usage

    <div class="dropdown">
      <div ww-dropdown-toggle="dropdown">
        ...
      </div>
      <div class="dropdown-menu">
        ...
      </div>
    </div>

Attribute ```ww-dropdown-toggle``` activates the directive. It can reference an object in the current scope which is used to expose some functions (open, close, toggle, isOpen) to programatically control the dropdown.
    

## Roadmap

see milestones and issues at https://github.com/w11k/w11k-dropdownToggle/issues


## License

MIT - see LICENSE file
